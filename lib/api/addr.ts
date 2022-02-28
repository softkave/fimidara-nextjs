const serverAddr =
    process.env.NODE_ENV === "development"
        ? `http://localhost:5000`
        : "https://api.shops.softkave.com";

const clientAddr =
    process.env.NODE_ENV === "development"
        ? `http://localhost:3000`
        : "https://shops.softkave.com";

export function getServerAddr() {
    return serverAddr;
}

export function getClientAddr() {
    return clientAddr;
}
