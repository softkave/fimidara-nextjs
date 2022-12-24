export interface IPromiseWithId<T = any> {
    promise: Promise<T>;
    id: string | number;
}

export interface ISettledPromise<V = any, R = any> {
    resolved: boolean;
    rejected: boolean;
    id: string | number;
    value?: V;
    reason?: R;
}

function wrapPromise(p: IPromiseWithId<any>) {
    return new Promise<ISettledPromise>(resolve => {
        p.promise
            .then(result =>
                resolve({
                    resolved: true,
                    rejected: false,
                    value: result,
                    id: p.id,
                })
            )
            .catch(error =>
                resolve({
                    resolved: false,
                    rejected: true,
                    reason: error,
                    id: p.id,
                })
            );
    });
}

const waitOnPromises = (
    promises: IPromiseWithId[]
): Promise<ISettledPromise[]> => {
    const mappedPromises = promises.map(wrapPromise);
    return Promise.all(mappedPromises);
};

export default waitOnPromises;
