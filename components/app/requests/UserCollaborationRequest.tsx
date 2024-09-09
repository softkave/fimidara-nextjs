import { Button } from "@/components/ui/button.tsx";
import { errorMessageNotificatition } from "@/components/utils/errorHandling.tsx";
import InlineLoading from "@/components/utils/page/InlineLoading.tsx";
import PageError from "@/components/utils/page/PageError.tsx";
import PageLoading from "@/components/utils/page/PageLoading.tsx";
import PageNothingFound from "@/components/utils/page/PageNothingFound.tsx";
import { appDimensions } from "@/components/utils/theme.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useUserCollaborationRequestFetchHook } from "@/lib/hooks/fetchHooks/userCollaborationRequest.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestResponseMutationHook } from "@/lib/hooks/mutationHooks";
import { getBaseError } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { formatRelative } from "date-fns";

export interface IUserCollaborationRequestProps {
  params: { requestId: string };
}

const classes = {
  main: css({
    width: "100%",
    maxWidth: appDimensions.app.maxWidth,
    margin: "auto",
  }),
};

function UserCollaborationRequest(props: IUserCollaborationRequestProps) {
  const { toast } = useToast();
  const { requestId } = props.params;
  const { fetchState, clearFetchState } = useUserCollaborationRequestFetchHook({
    requestId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);
  const respondHook = useUserCollaborationRequestResponseMutationHook({
    onSuccess(data, params) {
      toast({ description: "Response submitted" });
      clearFetchState();
    },
    onError(e, params) {
      errorMessageNotificatition(e, /** defaultMessage */ undefined, toast);
    },
  });

  if (resource) {
    {
      const createdDate = formatRelative(
        new Date(resource.createdAt),
        new Date()
      );
      const expirationDate =
        resource.expiresAt &&
        formatRelative(new Date(resource.expiresAt), new Date());
      const statusDate = formatRelative(
        new Date(resource.statusDate),
        new Date()
      );
      const statusText =
        resource.status === "accepted"
          ? "accepted"
          : resource.status === "declined"
          ? "declined"
          : resource.status === "revoked"
          ? "revoked"
          : "pending";

      const actions =
        resource.status === "pending" ? (
          respondHook.loading ? (
            <InlineLoading />
          ) : (
            <div className="space-x-4">
              <Button
                type="button"
                variant="destructive"
                loading={respondHook.loading}
                onClick={() =>
                  respondHook.run({
                    body: {
                      requestId: resource.resourceId,
                      response: "declined",
                    },
                  })
                }
              >
                Decline Request
              </Button>
              <Button
                type="button"
                loading={respondHook.loading}
                onClick={() =>
                  respondHook.run({
                    body: {
                      requestId: resource.resourceId,
                      response: "accepted",
                    },
                  })
                }
              >
                Accept Request
              </Button>
            </div>
          )
        ) : (
          <span>
            Collaboration request <strong>{statusText}</strong> {statusDate}
          </span>
        );

      return (
        <div className={classes.main}>
          <div className="space-y-8">
            <div className="space-y-0.5">
              <h4>Collaboration Request from {resource.workspaceName}</h4>
              <span className="text-secondary">Sent {createdDate}</span>
            </div>
            {resource.message && expirationDate ? (
              <div className="space-y-0.5">
                {resource.message && <p>{resource.message}</p>}
                {expirationDate && (
                  <span className="text-secondary">
                    Expires {expirationDate}
                  </span>
                )}
              </div>
            ) : null}
            {actions}
          </div>
        </div>
      );
    }
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching collaboration request"}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading request..." />;
  } else {
    return <PageNothingFound message="Collaboration request not found" />;
  }
}

export default UserCollaborationRequest;
