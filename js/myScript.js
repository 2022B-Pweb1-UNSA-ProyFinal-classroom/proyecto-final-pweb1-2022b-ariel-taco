/**
 * Esta función muestra un formulario de login (para fetch)
 * El botón enviar del formulario deberá invocar a la función doLogin
 * Modifica el tag div con id main en el html
 */

var xml;
function showLogin(){
  let formhtml = `<label>User</label><br>
              <input type ="text" id="user" name ="user" ><br>
              <label> password </label><br>
              <input type ="password" id="password" name ="password"><br>
              <button onclick ="doLogin()">Ingresar</button> 
              <p id="mensaje" ></p>`;
  document.getElementById('main').innerHTML = formhtml;
}