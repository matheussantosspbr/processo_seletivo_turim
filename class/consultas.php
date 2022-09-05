<?php

class bd
{
  // Função da conexão
  public function conexao()
  {
    // Conexão heroku PostgreSQL
    // Você pode acessar o banco de dados com o DBeaver
    $endereco = 'ec2-44-205-64-253.compute-1.amazonaws.com';
    $dbName = 'dc3s8c8ml7a0hv';
    $dbUser = 'mnskoqzkwumazb';
    $senha = 'cd2b41c3098727d4fc580023b34800ffbbf85e99246edf1393c361d32e205386';
    try {
      // Conexão PDO
      $con = new PDO("pgsql:host=$endereco;port=5432;dbname=$dbName", $dbUser, $senha, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
      // echo "conectado";
    } catch (PDOException $e) {
      return $e->getMessage();
    }
    return $con;
  }

  public function gravar($json)
  {

    if (!($json['pessoas'] == array())) {
      $conexao = $this->conexao();
      //Limpar Banco de Dados
      $this->limparDb();
      // Criar Tabelas
      $this->criarDb();
      //
      for ($i = 0; $i < count($json['pessoas']); $i++) {
        for ($j = 0; $j < count($json['pessoas'][$i]['filhos']); $j++) {
          $sqlFilhos = $conexao->prepare(
            'INSERT INTO
                filhos(pessoas_id, nome)
              VALUES
                (?,?)'
          );
          $id = $i + 1;
          $sqlFilhos->bindParam(1, $id);
          $sqlFilhos->bindParam(2, $json['pessoas'][$i]['filhos'][$j]);
          $sqlFilhos->execute();
          $sqlFilhos->fetchAll(PDO::FETCH_ASSOC);
        }
        $sqlPais = $conexao->prepare(
          'INSERT INTO
              pessoas(nome)
            VALUES
              (?)'
        );
        $sqlPais->bindParam(1, $json['pessoas'][$i]['pessoa']);
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

    //Query para apagar a tabela Filhos
    $sqlDropFil = $conexao->prepare('DROP TABLE filhos');
    $sqlDropFil->execute();
    $sqlDropFil->fetchAll(PDO::FETCH_ASSOC);
    //Query para apagar a tabela Pessoas
    $sqlDropPess = $conexao->prepare('DROP TABLE pessoas');
    $sqlDropPess->execute();
    $sqlDropPess->fetchAll(PDO::FETCH_ASSOC);
  }

  public function criarDb()
  {
    $conexao = $this->conexao();

    //Query para criar a tabela Filhos
    $sqlCriarDbFil = $conexao->prepare('
    CREATE TABLE filhos(
      id serial PRIMARY KEY,
      pessoas_id INT,
      nome VARCHAR(15)
    );
    ');
    $sqlCriarDbFil->execute();
    $sqlCriarDbFil->fetchAll(PDO::FETCH_ASSOC);

    //Query para criar a tabela Pessoas
    $sqlCriarDbPess = $conexao->prepare('
    CREATE TABLE pessoas(
      id serial PRIMARY KEY,
      nome VARCHAR(15)
    );
    ');
    $sqlCriarDbPess->execute();
    $sqlCriarDbPess->fetchAll(PDO::FETCH_ASSOC);
  }
}
