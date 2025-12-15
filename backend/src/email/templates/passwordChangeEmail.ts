export const passwordChangeEmail = (passwordChangeLink: string, domain: string): string => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <style>
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'sans-serif';
        src: url(https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap) format('woff2');
      }

      * {
        font-family: 'Open Sans', sans-serif;
      }
    </style>
  </head>

  <body style="background:radial-gradient(155.54% 155.54% at 50% -16.68%, #28c2a0 6.66%, #048271 58.71%, #004440 100%);font-family:&quot;Open Sans&quot;, sans-serif;padding:32px 48px;min-height:100vh;box-sizing:border-box;margin:auto">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;margin:auto;margin-bottom:20px">
      <tbody>
        <tr>
          <td>
          <td align="right" data-id="__react-email-column" style="width:48%"><img alt="Procareful Logo" height="24" src="${domain}/prc-logo.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:10px" width="24" /></td>
          <td align="left" data-id="__react-email-column" style="width:52%">
            <p style="font-size:24px;line-height:24px;margin:16px 0;width:fit-content;text-align:center;font-weight:700;color:#F9F9F8">Procareful</p>
          </td>
          </td>
        </tr>
      </tbody>
    </table>
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:504px !important;background:#FCFCFC;margin:auto;padding:20px 24px 32px 24px;border-radius:8px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:504px">
              <tbody>
                <tr>
                  <td>
                    <h1 style="text-align:center;font-size:24px">Confirm password change</h1>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:32px;color:#1F2933;text-align:left">You recently requested to change your password for your 
Procareful account. Please confirm this change by entering the verification code below on our website.</p>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#1F2933;text-align:left">If you did not request this change, please contact your Institution immediately.</p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em">
                      <tbody>
                        <tr style="width:100%">
                          <td>
                          <td data-id="__react-email-column" style="width:15%">
                            <p style="font-size:16px;line-height:24px;margin:0;font-weight:700">Important:</p>
                          </td>
                          <td align="left" data-id="__react-email-column">
                            <p style="font-size:16px;line-height:24px;margin:0">This link will expire in 10 minutes.</p>
                          </td>
                  </td>
                </tr>
              </tbody>
            </table><a href=${passwordChangeLink} style="line-height:24px;text-decoration:none;display:block;max-width:100%;background-color:#079A82;border-radius:2px;color:#fff;font-size:16px;text-align:center;width:86%;margin:0 auto;margin-top:48px;padding:8px 8px 8px 8px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 8px;mso-font-width:-100%;mso-text-raise:12" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px">Confirm change</span><span><!--[if mso]><i style="letter-spacing: 8px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
            <p style="font-size:16px;line-height:24px;margin:16px 0;color:#1F2933;text-align:left;margin-top:48px;margin-bottom:4px">Or click a link:</p><a href=${passwordChangeLink} style="color:#079A82;text-decoration:none;margin-right:50px" target="_blank">${passwordChangeLink}</a>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <p style="font-size:14px;line-height:22px;margin:16px 0;text-align:center;color:#F9F9F8">If you believe this is a mistake, please ignore this email</p>
  </body>

</html>
`;
