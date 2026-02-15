import app from './src/server.js';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
