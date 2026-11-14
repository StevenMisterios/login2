// 🔑 Datos de tu proyecto Supabase — tal como los dio tu profesor
const SUPABASE_URL = "https://hypxybgvxvpwfqflijty.supabase.co";
const SUPABASE_KEY = "sb_publishable_x6A2XiGzM9F2Qlk9xwBUvA_UK3HoJJz";

// Inicializar conexión con la base de datos
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos del formulario
const emailInput = document.getElementById('email');
const passInput = document.getElementById('pass');
const btnEntrar = document.getElementById('btnEntrar');
const btnSalir = document.getElementById('btnSalir');
const mensaje = document.getElementById('mensaje');
const formLogin = document.getElementById('formLogin');
const paginaBienvenida = document.getElementById('paginaBienvenida');
const usuarioMostrado = document.getElementById('usuarioMostrado');

// Eventos
btnEntrar.addEventListener('click', iniciarSesion);
btnSalir.addEventListener('click', cerrarSesion);
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') iniciarSesion();
});

// Mostrar mensajes en pantalla
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = 'block';
}

// Función para iniciar sesión — consulta a la base de datos
async function iniciarSesion() {
    const email = emailInput.value.trim();
    const password = passInput.value;
    
    mensaje.style.display = 'none';

    // Validar que no queden campos vacíos
    if (!email || !password) {
        mostrarMensaje("⚠️ Completa todos los campos", "error");
        return;
    }

    // Conectar y validar contra la base de datos
    btnEntrar.disabled = true;
    btnEntrar.textContent = "Conectando...";

    try {
        // 📡 CONSULTA REAL A SUPABASE
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // ✅ Usuario existe y es correcto
        formLogin.style.display = 'none';
        paginaBienvenida.style.display = 'block';
        usuarioMostrado.textContent = email;

    } catch (err) {
        // ❌ Usuario no existe o contraseña incorrecta
        let textoError = "❌ Usuario o contraseña inválidos";
        
        if (err.message.includes("Invalid login credentials")) {
            textoError = "❌ Usuario o contraseña incorrectos";
        } else if (err.message.includes("fetch") || err.message.includes("network")) {
            textoError = "⚠️ No se pudo conectar a la base de datos";
        }
        
        mostrarMensaje(textoError, "error");
    } finally {
        btnEntrar.disabled = false;
        btnEntrar.textContent = "Entrar";
    }
}

// Cerrar sesión
async function cerrarSesion() {
    await supabase.auth.signOut();
    paginaBienvenida.style.display = 'none';
    formLogin.style.display = 'block';
    emailInput.value = '';
    passInput.value = '';
    mensaje.style.display = 'none';
}
