from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Habilitar CORS para permitir solicitudes desde tu frontend

# Configuración del correo electrónico
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USER = os.getenv('EMAIL_USER', 'tu_correo@gmail.com')  # Tu correo electrónico
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')  # Tu contraseña o clave de aplicación
EMAIL_RECIPIENT = os.getenv('EMAIL_RECIPIENT', 'davidgf444@gmail.com')  # Correo donde recibirás los mensajes
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'online',
        'message': 'API del formulario de contacto está funcionando. Usa POST /api/contact para enviar mensajes.'
    })
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        # Obtener datos del formulario
        data = request.json
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', '')
        message = data.get('message', '')
        
        # Validar datos
        if not all([name, email, subject, message]):
            return jsonify({
                'success': False,
                'message': 'Todos los campos son obligatorios'
            }), 400
        
        # Crear mensaje de correo electrónico
        msg = MIMEMultipart()
        msg['From'] = f"Formulario de Contacto <{EMAIL_USER}>"
        msg['To'] = EMAIL_RECIPIENT
        msg['Subject'] = f"Formulario de contacto: {subject}"
        
        # Construir el cuerpo del mensaje en texto plano
        text_body = f"""
        Has recibido un nuevo mensaje desde el formulario de contacto de tu portfolio:
        
        Nombre: {name}
        Email: {email}
        Asunto: {subject}
        
        Mensaje:
        {message}
        """
        
        # Construir el cuerpo del mensaje en HTML
        html_body = f"""
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Asunto:</strong> {subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>{message.replace(chr(10), '<br>')}</p>
        """
        
        # Adjuntar versiones de texto y HTML
        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))
        
        # Enviar correo electrónico
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()  # Iniciar conexión segura
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        return jsonify({
            'success': True,
            'message': 'Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo pronto.'
        })
        
    except Exception as e:
        print(f"Error al enviar el correo: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.'
        }), 500
    
if __name__ == '__main__':
    # Obtener el puerto del entorno (Dokku lo asignará) o usar 5000 por defecto
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
