export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log(`process pid: ${process.pid}`);
  }
}
