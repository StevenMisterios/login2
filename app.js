// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://hypxybgvxvpwfqflijty.supabase.co";
const SUPABASE_KEY = "sb_publishable_x6A2XiGzM9F2Qlk9xwBUvA_UK3HoJJz";

// INICIALIZAR CLIENTE
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ELEMENTOS DEL FORMULARIO
const formLogin = document.getElementById('formLogin');
const usuarioInput = document.getElementById('usuario');
const contrasenaInput = document.getElementById('contrasena');
const mensaje = document.getElementById('mensaje');

// CUANDO SE ENVÍE EL FORMULARIO
formLogin.addEventListener('submit', async function(e) {
    e.preventDefault(); // Evitar que se recargue la página

    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value;

    mensaje.textContent = "Verificando... ⏳";
    mensaje.className = "";

    try {
        // CONSULTAR DIRECTAMENTE A LA TABLA usuarios
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', usuario)
            .single();

        // Si no se encuentra el usuario
        if (error) {
            throw new Error("Usuario no encontrado");
        }

        // VERIFICAR CONTRASEÑA
        if (data.contrasena === contrasena) {
            // ✅ USUARIO Y CONTRASEÑA CORRECTOS
            mensaje.textContent = `¡Bienvenido, ${usuario}! ✅`;
            mensaje.className = "exito";

            // Ir a página de bienvenida en 1.5 segundos
            setTimeout(() => {
                window.location.href = "bienvenida.html";
            }, 1500);
        } else {
            // ❌ CONTRASEÑA INCORRECTA
            mensaje.textContent = "Contraseña incorrecta ❌";
            mensaje.className = "error";
        }

    } catch (err) {
        // ❌ USUARIO NO EXISTE
        mensaje.textContent = "Usuario inválido o no existe ❌";
        mensaje.className = "error";
    }
});
