<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <title>Turim</title>
</head>

<body>
  <main>
    <div id="inputs">
      <label>
        <strong>Nome:</strong>
      </label>
      <input type="text" id="inputTexto" placeholder="Digite seu Nome..." />
      <button class="but incluir">Incluir</button>
    </div>
    <div class="info">
      <div class="pessoas">
        <h1>Pessoas</h1>
        <ul class="contreinnerPessoas"></ul>
      </div>
      <div class="textarea">
        <form action="teste.php" method="post">
          <textarea id="campoJSON" cols="30" rows="25" name="json"></textarea>
          <div class="buts">
            <button class="but gravar" name="gravar">Gravar</button>
            <button class="but ler" name="ler">Ler</button>
          </div>
        </form>
      </div>
    </div>
  </main>
  <script src="script.js"></script>
</body>

</html>