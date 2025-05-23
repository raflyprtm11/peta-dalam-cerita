exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Contoh validasi login sederhana
        if (username === 'admin' && password === '123456') {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login berhasil' }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Username atau password salah' }),
            };
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request tidak valid' }),
        };
    }
};
