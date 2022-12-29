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
/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la 
 * función doCreateAccount
 * */
function showCreateAccount(){
  let formhtml = 
    `<label>Username</label><br>
              <input type ="text" id="username" name ="user" ><br>
              <label>Firstname </label><br>
              <input type ="text" id="firstname" name ="firstname"><br>
              <label>Lastname </label><br>
              <input type ="text" id="lastname" name ="lastname"><br>
              <label>Password </label><br>
              <input type ="password" id="password" name ="password"><br>
              <button onclick ="doCreateAccount()">Registrar</button> 
              <p id="mensaje" ></p>`;
  document.getElementById('main').innerHTML = formhtml;


}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
  let user = document.getElementById('username').value;
  let firstName = document.getElementById('firstname').value;
  let lastName = document.getElementById('lastname').value;
  let password = document.getElementById('password').value;
  console.log("datos recogidos:",user,firstname,lastname,password);
  let url = 'cgi-bin/register.pl?userName='+user+'&password='+password+'&firstName='+
    firstName+'&lastName='+lastName;
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
/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario 
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList(){
  console.log("este es el owne que sera enviado al cgi",userKey);
  let url = 'cgi-bin/list.pl?owner='+userKey;
  console.log("este cgi se usara",url);
  let promise = fetch(url);
  promise.then(response=>response.text()).then(data=>
    {
      xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      console.log(xml);
      showList(xml);
    }).catch(error=>{
      console.log('Error :', error);
    });
}
/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml){
  console.log("se ingreso a la funcion showListi se recibo",xml);
  var  articulos = xml.getElementsByTagName('article');
  var owners = xml.getElementsByTagName('owner');
  var titulos = xml.getElementsByTagName('title');
  console.log("articulo",articulos);
  console.log("tamaño de la coleccion",articulos.length);
  var numArticulos = articulos.length;
  var listhtml="";
  if(numArticulos==0){
    console.log("no tiene ningun articulo");
    html = `<p>No tiene articulos</p>
               `;
  }else{
    console.log("si tiene articulos")
    console.log("esto son",titulos);
    console.log("primer owner and title",owners[0].textContent,titulos[0].textContent);
    console.log(typeof(owners[0].textContent));
    listhtml = "<ol>";
    for (let i=0; i < numArticulos ; i++){
      listhtml += "<li>"+titulos[i].textContent+
        `<button onclick = "doView(`+`'`+owners[i].textContent+`'`+`,`+`'`+ titulos[i].textContent+`'`+`)">View</button>`+
        `<button onclick = "doDelete(`+`'`+owners[i].textContent+`'`+`,`+`'`+ titulos[i].textContent+`'`+`)">Delete</button>`+
        `<button onclick = "doEdit(`+`'`+owners[i].textContent+`'`+`,`+`'`+ titulos[i].textContent+`'`+`)">Edit</button>`+
        "</li> \n";
    }listhtml += "</ol>";

  }

  document.getElementById('main').innerHTML = listhtml;

}

/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew 
 * - Cancelar, que invoca doList
 */
function showNew(){
  var formhtml = "";
  formhtml += `
             <label>Titulo</label>
             <input type = "text" id="titulo" name ="titulo" value= ""><br>
             <label > texto</label>
             <textarea style = "width:180px; height:150px" id = "cuadrotext" name ="texto"></textarea>          `+`<button onclick ="doNew()">Enviar</button>`+`
                 <button onclick = "doList()">Cancelar</button>`;
  document.getElementById('main').innerHTML = formhtml;
}

/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la 
 * función responseNew
 */
function doNew(){
  let title  = document.getElementById('titulo').value;
  let texto = document.getElementById('cuadrotext').value;
  console.log("datos recogidos:",title,texto);
  let url1 = 'cgi-bin/new.pl?title='+title+'&text='
  let textoencode = encodeURIComponent(texto);
  let url3 = '&owner='+userKey;
  let urlcomple= url1+textoencode+url3;
  console.log(urlcomple)
  var response;
  let promise = fetch(urlcomple);
  promise.then(response=>response.text()).then(data=>
    {
      response = (new window.DOMParser()).parseFromString(data, "text/xml");
      console.log(response);
      responseNew(response) ;
    }).catch(error=>{
      console.log('Error :', error);
    });
}

