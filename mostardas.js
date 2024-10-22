document.addEventListener('DOMContentLoaded', function() {
    var dadosList = document.getElementById("dados-list");
    // if (!dadosList) {
    //     console.error('Elemento com ID "dados-list" não encontrado.');
    //     return;
    // }
  
    var cont = 0;
    // Removido o ajuste da hora
    var database = firebase.database();
    var dadosRef = database.ref("data");
    let lastHora = null;
  
    // Escuta alterações contínuas no banco de dados
    dadosRef.on("value", function(snapshot) {
        // Limpa a tabela antes de adicionar os novos dados
        dadosList.innerHTML = "";
  
        if (!snapshot.exists()) {
            console.log("Nenhum dado encontrado.");
        } else {
            snapshot.forEach(function(childSnapshot) {
                var temperature = childSnapshot.child("temperatura").val();
                var dia = childSnapshot.child("data").val();
                var hora = childSnapshot.child("hora").val();
                console.log(temperature);
                console.log(hora);
                inserir_dados(dia,hora, temperature);
  
            });
        }
    });
  
    function inserir_dados(dia, hora, temperature) {
        var newRow = dadosList.insertRow();
        newRow.insertCell(0).textContent = cont++; // ID
        newRow.insertCell(1).textContent = dia;
        console.log(dia);
        newRow.insertCell(2).textContent = hora;
        newRow.insertCell(3).textContent = temperature;
    }
  });
  