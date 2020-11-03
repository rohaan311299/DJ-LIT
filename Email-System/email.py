#importing the libraries
import smtplib
import imghdr
from email.message import EmailMessage
import pandas as pd
import numpy as np

# data.csv is the file containg all the email id in 1st coloumn 
# Make sure files are in the same directory
df = pd.read_csv('data.csv', error_bad_lines=False , header=None)

Sender_Email = "email_id"
Password = "password"
smtp = smtplib.SMTP_SSL('smtp.gmail.com', 465)  
smtp.login(Sender_Email, Password)

array = np.array(df[0])

for element in array:
    Reciever_Email = element
    newMessage = EmailMessage()                         
    newMessage['Subject'] = "Add Subject" 
    newMessage['From'] = Sender_Email                   
    newMessage['To'] = Reciever_Email                   
    newMessage.set_content('Add Message') 
    # Make sure files are in the same directory
    files = ['Pdfname.pdf']
    

    for file in files:
        with open(file, 'rb') as f:
            file_data = f.read()
            file_name = f.name
        newMessage.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)                  
    smtp.send_message(newMessage)   
    print("Email sent to : "+element)   
