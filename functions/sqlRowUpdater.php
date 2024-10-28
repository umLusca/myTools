<?php



/**
 * Retorna os parâmetros necessários para fazer um mysqli_prepare();
 * <h2>Exemplo de uso</h2>
 *  $arr = ("coluna"=>"valor" , "coluna2"=>"valor2" );<br/><br/>
 *  $return = get_stmt($arr);<br/><br/>
 *  $q = mysqli_prepare($con,"UPDATE tabela SET <b>{return["query"]}</b>;");<br/>
 *  $q->bind_param(<b>$return["bind"]</b>,...<b>$return["values"]</b>);<br/>
 *  $q->execute();<br/>
 *
 *
 * @param false|PDO &$con [Opcional]
 *  <p>
 *  Se não houver, ele puxa uma conexão pela função con(); e Retorna a conexão no final
 *  </p>
 * @param array $updates [Obrigatório] <p>
 * Um Array contendo indices e valores, sendo a coluna e valor respectivamente a tabela que será aplicada.<br/>
 * Exemplo:
 * <ul>
 * <li>array(<br/>      "nome" => "Lucas",<br/>       "idade" => 18<br/>);</li>
 * </ul>
 * </p>
 * @param array|string $includes [Obrigatório]
 *  <p>
 *  <h4>Array</h4>
 *  Fará com que apenas os indices dentro deste array sejam atualizados. Sendo limitado apenas pelo <b>$excludes</b>,
 *  isto é, caso tenha uma coluna que esteja em ambos, será priorizado a exclusão no processo.
 *  Exemplo:
 *  <ul>
 *  <li>array("nome","idade");</li>
 *  </ul>
 *  <h4>String</h4>
 *  Será o nome da tabela, que será alterado. Fazendo com que o $con Seja obrigatório para poder pegar as colunas dentro da mesma.
 *  E fazendo assim, o includes automaticamente. Sendo limitado apenas ao $excludes.
 *  </p>
 * @param false|array $excludes [Opcional]
 * <p> Um Array contendo colunas que deverão ser excluídas ou não alteráveis no processo.
 *  Exemplo:
 * <ul>
 * <li>array("nome","idade");</li>
 * </ul>
 * Com isso, as colunas <b>Nome</b> e <b>Idade</b> não vão ser alteradas, mesmo que dentro do array principal.
 * </p>
 * @return array
 * <p>
 *  Retorna um Array com 3 Valores sendo <br />
 *  <var>$return["query"]</var>: uma string que contem cada atualização para alterar no banco de dados.
 *   <var>$return["values"]</var>: uma array contendo os valores separados de cada coluna na ordem da $return["query"].
 * <p>
 */
function sqlAutoUpdater(false|PDO &$con, array $updates, array|string $includes, false|array $excludes): array
{
	$bind = "";
	$values = [];
	$query = "";
	if (!$con) {
		$con = con();
	}
	if (isset($includes, $con) && is_string($includes)) {
		$_d = $con->query("SHOW COLUMNS FROM {$includes} ;");
		
		$includes = [];
		foreach ($_d as $f) {
			$includes[] = $f["Field"];
		}
	}
	foreach ($updates as $item => $valor) {
		if (is_array($excludes) && in_array($item, $excludes, true)) {
			continue;
		}
		
		if (is_array($includes) && !in_array($item, $includes, true)) {
			continue;
		}
		
		if (!empty($values)) {
			$query .= ", ";
		}
		$query .= "$item = ?";
		
		if (is_bool($valor)) {
			$values[] = $valor ? 1 : 0;
		} else if (is_string($valor)) {
			$values[] = htmlspecialchars($valor);
		} else {
			$values[] = $valor;
			
		}
	}
	
	return array(
		"query"  => $query,
		"values" => $values
	);
}