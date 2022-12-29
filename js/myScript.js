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

/**
 * Esta función recolecta los valores ingresados en el formulario
 * y los envía al CGI login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){
  let user = document.getElementById('user').value;
  let password = document.getElementById('password').value;
  console.log(user);
  console.log(password);
  let url = 'cgi-bin/login.pl?user='+user+'&password='+password;
  console.log(url);
  var xml;
  let promise = fetch(url);
  promise.then(response=>response.text()).then(data=>
    {
      xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      console.log(xml);
      loginResponse(xml) ;
    }).catch(error=>{
      console.log('Error :', error);
    });

}
/**
 * Esta función recibe una respuesta en un objeto XML
 * Si la respuesta es correcta, recolecta los datos del objeto XML
 * e inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion showLoggedIn.
 * Si la respuesta es incorrecta, borra los datos del formulario html
 * indicando que los datos de usuario y contraseña no coinciden.
 */
function loginResponse(xml){
  var usuario = xml.getElementsByTagName('user');
  var owner = usuario[0].getElementsByTagName('owner');
  console.log(owner.length);
  if(owner.length==1){
    var ownerValue = owner[0].textContent;
    var firstName = usuario[0].getElementsByTagName('firstName');
    var firstNameValue = firstName[0].textContent;
    var lastName = usuario[0].getElementsByTagName('lastName');
    var lastNameValue = lastName[0].textContent;
    console.log('datos correctos, ingreso');
    userFullName = firstNameValue+" "+ lastNameValue;
    console.log(userFullName);
    userKey = ownerValue;
    console.log(userKey);
    showLoggedIn();
  }else{
    console.log('datos, incorrectos');
    showLogin();
    document.getElementById('mensaje').innerHTML = "Datos incorrectos";
  }
}
/**
 * esta función usa la variable userFullName, para actualizar el
 * tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function showLoggedIn(){
  document.getElementById('userName').innerHTML = userFullName;
  showWelcome();
  showMenuUserLogged();
}
