export const verificationCodeEmail = (
  code: string,
  domain: string,
  verificationCode: string,
  completeVerificationProcess: string,
  important: string,
  expireCode: string,
  footer: string,
  hello: string,
  name: string,
): string => {
  const formattedCode = code.split('');
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                    <h1 style="text-align:center;font-size:24px">${verificationCode}</h1>
                    <h2>${hello} ${name}!</h2>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:32px;color:#1F2933;text-align:left">${completeVerificationProcess}</p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em">
                      <tbody>
                        <tr style="width:100%">
                          <td>
                          <td data-id="__react-email-column" style="width:15%">
                            <p style="font-size:16px;line-height:24px;margin:0;font-weight:700">${important}:</p>
                          </td>
                          <td align="left" data-id="__react-email-column">
                            <p style="font-size:16px;line-height:24px;margin:0">${expireCode}</p>
                          </td>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:48px auto 0 auto;width:53%">
              <tbody>
                <tr style="width:100%">
                  <td>
                  ${formattedCode
                    .map(
                      (el) => `
                                    <td align="center" data-id="__react-email-column">
                    <p style="font-size:30px;line-height:24px;margin:16px 0;font-weight:700">${el}</p>
                  </td>
                  `,
                    )
                    .join('')}
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <p style="font-size:14px;line-height:22px;margin:16px 0;text-align:center;color:#F9F9F8">${footer}</p>
  </body>

</html>`;
};
