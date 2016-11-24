function changePasswordsAndSendThem() {
  var passLength = 10;
  var orgUnitPath = "/password-reset" //suborganization
  var pageToken, page;
  do {
    page = AdminDirectory.Users.list({
      domain: 'bestis.ro',
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var secondaryEmail = user["emails"][0]["address"]
        var primaryEmail = user.primaryEmail;
        var newPassword = randomPassword(passLength);
       
        if (user.orgUnitPath == orgUnitPath) {
        
          //set new password
          setPassword(newPassword,user.id); 
          
          //send email with new password to secondary email address
          sendEmail(secondaryEmail,primaryEmail,newPassword);
          Logger.log('Password for %s changed to %s, email @bestis %s, email personal %s', user.name.fullName, newPassword, primaryEmail, secondaryEmail);
        }
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
}

function randomPassword(length) {
  var result = '';
  charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@$%^&amp;*()-_+={}[]\\|&lt;,&gt;.?/"
  for (var i = length; i > 0; --i) {
    result += charset[Math.floor(Math.random() * charset.length)]
  };
  return result;
}


function sendEmail(currentAddress, primaryEmail, password){
  var message = "Email address: " + primaryEmail + "<br>Password " + password + "<br>Please login <a href=http://mail.bestis.ro> to change your password!</a>";
  MailApp.sendEmail({
    to: currentAddress,
    subject: "***[ITC][Personal]Temporary password for @bestis.ro account",
    htmlBody: message
  });
}

function setPassword(password, userid){
   AdminDirectory.Users.update({"password": password}, userid)
}

/*
function returnSubOrg() {
  var pageToken, page;
  do {
    page = AdminDirectory.Users.list({
      domain: 'bestis.ro',
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken,
    });
    var users = page.users;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      Logger.log(user["orgUnitPath"]);
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
}*/
