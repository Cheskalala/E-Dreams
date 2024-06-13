const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Ruta para devolver la página web
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

// Ruta para obtener todas las canciones
app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar una canción
app.post('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        const canciones = JSON.parse(data);
        const nuevaCancion = req.body;
        canciones.push(nuevaCancion);
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), 'utf8', err => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.status(201).send('Canción agregada');
        });
    });
});

// Ruta para actualizar una canción
app.put('/canciones/:id', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        const canciones = JSON.parse(data);
        const id = req.params.id;
        const cancionActualizada = req.body;
        const index = canciones.findIndex(c => c.id.toString() === id);
        if (index !== -1) {
            canciones[index] = cancionActualizada;
            fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), 'utf8', err => {
                if (err) {
                    res.status(500).send('Error al escribir en el archivo');
                    return;
                }
                res.send('Canción actualizada');
            });
        } else {
            res.status(404).send('Canción no encontrada');
        }
    });
});

// Ruta para eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        const canciones = JSON.parse(data);
        const id = req.params.id;
        const index = canciones.findIndex(c => c.id === id);
        if (index !== -1) {
            canciones.splice(index, 1);
            fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), 'utf8', err => {
                if (err) {
                    res.status(500).send('Error al escribir en el archivo');
                    return;
                }
                res.send('Canción eliminada');
            });
        } else {
            res.status(404).send('Canción no encontrada');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
