// Configuración de Supabase
const SUPABASE_URL = "https://hypxybgvxvpwfqflijty.supabase.co";
const SUPABASE_KEY = "sb_publishable_x6A2XiGzM9F2Qlk9xwBUvA_UK3HoJJz";

// Inicializar cliente
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos del DOM
const formLogin = document.getElementById('formLogin');
const usuarioInput = document.getElementById('usuario');
const contrasenaInput = document.getElementById('contrasena');
const mensaje = document.getElementById('mensaje');

// Manejar envío del formulario
formLogin.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value;
    
    mensaje.textContent = '';
    mensaje.className = '';

    try {
        // 🔑 Opción A: Usar función de Supabase (como te mostró el profe)
        const { data, error } = await supabase.functions.invoke('login-aunar', {
            body: { usuario, contrasena }
        });

        if (error) {
            throw error;
        }

        procesarRespuesta(data);

    } catch (err) {
        // 🔑 Opción B: Consulta directa a tabla (si la función no está lista)
        console.log("Usando consulta directa como respaldo...");
        await verificarUsuarioDirecto(usuario, contrasena);
    }
});

// Procesar respuesta de la función
function procesarRespuesta(data) {
    if (data.existe) {
        mostrarExito(data.mensaje || "¡Bienvenido, " + data.usuario + "!");
    } else {
        mostrarError(data.mensaje || "Usuario inválido");
    }
}

// Verificación directa a la base de datos (plan B)
async function verificarUsuarioDirecto(usuario, contrasena) {
    // ⚠️ IMPORTANTE: En producción NO guardes contraseñas en texto plano
    // Este ejemplo es para fines educativos
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .single();

    if (error) {
        mostrarError("Usuario inválido ❌");
        return;
    }

    if (data && data.contrasena === contrasena) {
        mostrarExito(`¡Bienvenido, ${usuario}! ✅`);
    } else {
        mostrarError("Contraseña incorrecta ❌");
    }
}

function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.className = 'error';
}

function mostrarExito(texto) {
    mensaje.textContent = texto;
    mensaje.className = 'exito';
    
    // Redirigir a página de bienvenida después de 1.5 segundos
    setTimeout(() => {
        alert("¡Ingresando al sistema! 🎉");
        // window.location.href = "bienvenida.html"; // Descomenta si creas esa página
    }, 1500);
}
