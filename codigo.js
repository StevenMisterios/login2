// ✅ DATOS DE TU PROYECTO SUPABASE
const SUPABASE_URL = "https://hypxybgvxvpwfqflijty.supabase.co";
const SUPABASE_KEY = "sb_publishable_x6A2XiGzM9F2Qlk9xwBUvA_UK3HoJJz";

// Inicializar conexión
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos del DOM
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
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') iniciarSesion();
});

// Mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = 'block';
}

// Función para iniciar sesión
async function iniciarSesion() {
    const email = emailInput.value.trim();
    const password = passInput.value;

    // Ocultar mensaje anterior
    mensaje.style.display = 'none';
    mensaje.className = 'mensaje';

    // Validar campos vacíos
    if (!email || !password) {
        mostrarMensaje("⚠️ Completa todos los campos", "error");
        return;
    }

    // Estado de carga
    btnEntrar.disabled = true;
    btnEntrar.textContent = "Conectando...";
    mostrarMensaje("🔄 Conectando a la base de datos...", "cargando");

    try {
        // 📡 CONECTAR CON SUPABASE
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // ✅ INICIO EXITOSO
        formLogin.style.display = 'none';
        paginaBienvenida.style.display = 'block';
        usuarioMostrado.textContent = email;

    } catch (err) {
        // ❌ MANEJO DE ERRORES
        let texto = "❌ Usuario o contraseña incorrectos";
        
        if (err.message.includes("Invalid login credentials")) {
            texto = "❌ Usuario o contraseña incorrectos";
        } else if (err.message.includes("fetch") || err.message.includes("network")) {
            texto = "⚠️ No se pudo conectar a Supabase. Verifica tu internet o la URL.";
        } else if (err.message) {
            texto = "❌ Error: " + err.message;
        }

        mostrarMensaje(texto, "error");
    } finally {
        btnEntrar.disabled = false;
        btnEntrar.textContent = "Entrar";
    }
}

// Función para cerrar sesión
async function cerrarSesion() {
    await supabase.auth.signOut();
    paginaBienvenida.style.display = 'none';
    formLogin.style.display = 'block';
    mensaje.style.display = 'none';
    emailInput.value = 'cehg@aunar.com';
    passInput.value = 'aunar123';
}
