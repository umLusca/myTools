<?php
$_CONFIG["SMTPHost"] = "";
$_CONFIG["SMTPName"] = "";
$_CONFIG["SMTPUser"] = "";
$_CONFIG["SMTPPass"] = "";
function sendMail($to, $subject, $body): true|string
{
	global $_CONFIG;
	$mail = new PHPMailer(true);
	try {
		// Configurações do servidor SMTP
		$mail->isSMTP();
		$mail->SMTPAuth = true;
		$mail->Host = $_CONFIG["SMTPHost"]; // Endereço do servidor SMTP
		$mail->Username = $_CONFIG["SMTPUser"];                  // Usuário do SMTP
		$mail->Password = $_CONFIG["SMTPPass"];             // Senha do SMTP
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Criptografia (TLS ou SSL)
		$mail->Port = 587;                                  // Porta do SMTP (587 para TLS)
		
		
		$mail->isHTML(true); // Definir e-mail como HTML
		$mail->setFrom($_CONFIG["SMTPUser"],$_CONFIG["SMTPName"]);
		$mail->FromName = $_CONFIG["SMTPName"]; // Seu nome
		
		$mail->addAddress($to);
		$mail->Subject = $subject;
		$mail->Body = $body;
		
		
		// Enviar e-mail
		if ($mail->send()) {
			
			return true;
		} else {
			return $mail->ErrorInfo;
		}
		
	} catch (Exception $e) {
		
		return $e;
	}
}