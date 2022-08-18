<?php

class bd
{
  public function conexao()
  {
    // Conexão heroku
    $endereco = 'ec2-44-205-64-253.compute-1.amazonaws.com';
    $dbName = 'dc3s8c8ml7a0hv';
    $dbUser = 'mnskoqzkwumazb';
    $senha = 'cd2b41c3098727d4fc580023b34800ffbbf85e99246edf1393c361d32e205386';
    try {
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

    $sql = $conexao->prepare(
      'SELECT
              a.nome as pais,
              b.nome as filhos,
              b.pessoas_id as id_do_pai
            from
              pessoas as a
              inner join filhos as b on a.id = b.id'
    );

    $sql->execute();
    $pessoasEFilhos = $sql->fetchAll(PDO::FETCH_ASSOC);


    print_r($pessoasEFilhos);
  }
}
