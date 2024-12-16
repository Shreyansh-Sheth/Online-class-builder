export const emailTemplate = (link: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
  </head>

  <body>
    <div class="box" style="margin-top: 50px; width: 100%;">
      <div class="inline-block inner-box little-rounded stack" style="display: inline-block; border-radius: 15px; background-color: #2194fc; padding: 15px;">
        <h1 class="heading text-white" style="color: #fff; display: block; text-align: center; font-family: 'Poppins', sans-serif; font-size: 2em; font-weight: 600; margin-top: 10px; margin-bottom: 10px;">Welcome To Tutor</h1>
        <p class="body text-white" style="color: #fff; display: block; font-family: 'Poppins', sans-serif;">
          Hey Traveller Welcome To Tutor. Online Platform For Educators.
        </p>
        <div class="my-20 flex-center" style="margin-top: 40px; margin-bottom: 20px; width: 100%; text-align: center;">
          <a href="${link}" class="button little-rounded" style="text-decoration: none; border-radius: 15px; color: #000; font-family: 'Poppins', sans-serif; display: inline; padding: 10px 5px; background-color: #fff;">Click Here To Continue</a>
        </div>
      </div>
    </div>
  </body>
</html>


`;
