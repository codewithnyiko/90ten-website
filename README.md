# 90Ten Group website

The company website for 90tengroup.co.za. A plain static site (HTML, CSS and a little JavaScript) in `wwwroot`, with a small .NET host for running it locally and for the contact form.

This project is separate from Kereke.

## Run it locally
```
dotnet run --urls http://localhost:5190
```
Open http://localhost:5190. With no mail server set, contact form emails are saved as files in `App_Data/outbox`.

## Put it live
The live site is the contents of `wwwroot`, served as static files by Caddy on the droplet from `/opt/90ten-site`:
```
ssh root@143.244.172.110 "mkdir -p /opt/90ten-site"
scp -r wwwroot/* root@143.244.172.110:/opt/90ten-site/
```
No restart is needed after copying new files.

## Contact form
`POST /api/contact` emails the team and sends the visitor a confirmation. Mail settings go in `appsettings.json` under `Contact` (host `mail.90tengroup.co.za`, port 587); keep the password out of git. The form is not live on the static site yet; visitors are asked to email hello@90tengroup.co.za.

## Facts on the site
Founded by Tinyiko Evans Novela, building software since 2014. 6 Saddle Circle, Blue Hills, Midrand, 1685. Slogan: Tailored. Engineered. Nurtured.
