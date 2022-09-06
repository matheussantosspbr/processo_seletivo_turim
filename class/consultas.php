<?php

class bd
{
  public function conexao()
  {
    // conexão Phpmyadmin -> MySQL
    $endereco = 'localhost';
    $dbName = 'turim';
    $dbUser = 'root';
    $senha = '';
    try {
      // Conexão PDO
      $con = new PDO("mysql:host=$endereco;dbname=$dbName", $dbUser, $senha, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
      // echo "conectado";
    } catch (PDOException $e) {
      return $e->getMessage();
    }
    return $con;
  }

  public function gravar($json)
  {

    if (!($json['pessoas'] == array())) {
      // estanciar a conexão
      $conexao = $this->conexao();

      //Limpar Banco de Dados
      $this->limparDb();

      // Criar Tabelas
      $this->criarDb();

      //Processo de Cadastro das pessoas
      for ($i = 0; $i < count($json['pessoas']); $i++) {
        for ($j = 0; $j < count($json['pessoas'][$i]['filhos']); $j++) {

          // cadastrar filhos
          $query = "INSERT INTO
                       `filhos` (`pessoas_id`, `nome`)
                     VALUES
                        (:id_pess, :nomeFil)";

          $sqlFilhos = $conexao->prepare($query);
          $id = $i + 1;
          $sqlFilhos->bindParam(":id_pess", $id);
          $sqlFilhos->bindParam(":nomeFil", $json['pessoas'][$i]['filhos'][$j]);
          $sqlFilhos->execute();
          $sqlFilhos->fetchAll(PDO::FETCH_ASSOC);
        }

        // Cadastrar Pais
        $queryPes = "INSERT INTO
                    `pessoas`(`nome`)
                  VALUES
                    (:nomePes)";
        $sqlPais = $conexao->prepare($queryPes);
        $sqlPais->bindParam(":nomePes", $json['pessoas'][$i]['pessoa']);
        $sqlPais->execute();
        $sqlPais->fetchAll(PDO::FETCH_ASSOC);
      }
    }
  }

  public function ler()
  {
    $conexao = $this->conexao();

    // Query para chamar Todos os pais
    $sqlPais = $conexao->prepare(
      'SELECT
        id,
        nome
      FROM
        pessoas
    '
    );
    $sqlPais->execute();
    $pais = $sqlPais->fetchAll(PDO::FETCH_ASSOC);

    // Query para chamar todos os Filhos
    $sqlFilhos = $conexao->prepare(
      'SELECT
        pessoas_id,
        nome
      FROM
        filhos
    '
    );
    $sqlFilhos->execute();
    $filhos = $sqlFilhos->fetchAll(PDO::FETCH_ASSOC);

    //Array JSON Principal
    $json = array(
      'pessoas' => []

    );

    // Adicionando os pais no array JSON principal
    for ($i = 0; $i < count($pais); $i++) {
      array_push($json['pessoas'], [
        "nome" => $pais[$i]['nome'],
        "filhos" => array()
      ]);
    }

    // Adicionando os Filhos para seus pais
    foreach ($filhos as $filho) {
      $id = $filho['pessoas_id'] - 1;
      array_push($json['pessoas'][$id]['filhos'], $filho['nome']);
    }
    return $json;
  }

  public function limparDb()
  {
    $conexao = $this->conexao();

    //Query para apagar a tabela Pessoas
    $sqlDropPess = $conexao->prepare('DROP TABLE pessoas');
    $sqlDropPess->execute();
    $sqlDropPess->fetchAll(PDO::FETCH_ASSOC);

    //Query para apagar a tabela Filhos
    $sqlDropFil = $conexao->prepare('DROP TABLE filhos ');
    $sqlDropFil->execute();
    $sqlDropFil->fetchAll(PDO::FETCH_ASSOC);
  }

  public function criarDb()
  {
    $conexao = $this->conexao();

    //Query para criar a tabela Filhos
    $sqlCriarDbFil = $conexao->prepare('
    create table filhos(
      id serial primary key,
      pessoas_id int,
      nome varchar(15)
    );
    ');
    $sqlCriarDbFil->execute();
    $sqlCriarDbFil->fetchAll(PDO::FETCH_ASSOC);

    //Query para criar a tabela Pessoas
    $sqlCriarDbPess = $conexao->prepare('
    create table pessoas(
      id serial primary key,
      nome varchar(15)
    );
    ');
    $sqlCriarDbPess->execute();
    $sqlCriarDbPess->fetchAll(PDO::FETCH_ASSOC);
  }
}
