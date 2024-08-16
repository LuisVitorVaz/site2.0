document.addEventListener('DOMContentLoaded', function() {
  var dadosList = document.getElementById("dados-list");
  // if (!dadosList) {
  //     console.error('Elemento com ID "dados-list" não encontrado.');
  //     return;
  // }

  var cont = 0;
  var dec_hora = 3;
  var database = firebase.database();
  var dadosRef = database.ref("dados"); // Ajuste conforme a estrutura do seu banco de dados
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

              // Subtrai 4 horas da hora recebida
              var [horaParte, minutoParte] = hora.split(':');
              var date = new Date();
              date.setHours(horaParte, minutoParte);
              date.setHours(date.getHours() - dec_hora);
              var Hora_atualizada = date.toTimeString().split(' ')[0].substring(0, 5);

              if (Hora_atualizada === lastHora) {
                  Hora_atualizada = adicionarMinutos(Hora_atualizada, 15);
              }

              console.log(Hora_atualizada);

              inserir_dados(dia, Hora_atualizada, temperature);

              lastHora = Hora_atualizada;

              const evento = new CustomEvent('atualizarDataHora', { detail: { dia, Hora_atualizada } });
              document.dispatchEvent(evento);
          });
      }
  });

  function adicionarMinutos(hora, minutos) {
      var [horaParte, minutoParte] = hora.split(':');
      var date = new Date();
      date.setHours(horaParte, minutoParte);
      date.setMinutes(date.getMinutes() + minutos);
      return date.toTimeString().split(' ')[0].substring(0, 5);
  }

  function inserir_dados(dia, hora, temperature) {
      var newRow = dadosList.insertRow();
      newRow.insertCell(0).textContent = cont++; // ID
      newRow.insertCell(1).textContent = dia;
      newRow.insertCell(2).textContent = hora;
      newRow.insertCell(3).textContent = temperature;
  }
});
