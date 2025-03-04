import { app } from './app';
import { config } from './config';
import { seedAdmin } from './seed';

const port = config.server.port;

async function startServer() {
    await seedAdmin();

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

startServer().catch(console.error);