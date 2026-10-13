using System.Collections.Concurrent;
using System.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
WebApplication app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

IConfigurationSection cfg = app.Configuration.GetSection("Contact");
ConcurrentDictionary<string, List<DateTime>> sent = new();

// The contact form: emails the team, and sends the visitor a confirmation.
app.MapPost("/api/contact", async (ContactForm form, HttpContext http, ILogger<Program> log) =>
{
    // The hidden field is for bots. Say thanks and drop it.
    if (!string.IsNullOrWhiteSpace(form.Website))
    {
        return Results.Ok(new { ok = true });
    }

    string name  = (form.Name ?? "").Trim();
    string email = (form.Email ?? "").Trim();
    string need  = (form.Need ?? "").Trim();
    string msg   = (form.Message ?? "").Trim();

    if (name.Length is 0 or > 120 || !MailboxAddress.TryParse(email, out _) || email.Length > 200 || msg.Length > 4000)
    {
        return Results.BadRequest(new { error = "Please add your name and a valid email." });
    }

    string ip = http.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    int max = cfg.GetValue("MaxPerHour", 5);
    List<DateTime> times = sent.GetOrAdd(ip, _ => new List<DateTime>());
    lock (times)
    {
        times.RemoveAll(t => t < DateTime.UtcNow.AddHours(-1));
        if (times.Count >= max)
        {
            return Results.Json(new { error = "Too many messages from this device. Please try again later." }, statusCode: 429);
        }
        times.Add(DateTime.UtcNow);
    }

    string to   = cfg["ToAddress"] ?? "";
    string from = cfg["FromAddress"] ?? "";
    string fromName = cfg["FromName"] ?? "90Ten Group";

    MimeMessage toTeam = new();
    toTeam.From.Add(new MailboxAddress(fromName, from));
    toTeam.To.Add(MailboxAddress.Parse(to));
    toTeam.ReplyTo.Add(new MailboxAddress(name, email));
    toTeam.Subject = $"New enquiry from {name}";
    toTeam.Body = new TextPart("plain")
    {
        Text = $"Name: {name}\nEmail: {email}\nNeeds: {need}\n\n{msg}\n"
    };

    MimeMessage reply = new();
    reply.From.Add(new MailboxAddress(fromName, from));
    reply.To.Add(new MailboxAddress(name, email));
    reply.Subject = "We got your message";
    reply.Body = new TextPart("plain")
    {
        Text = $"Hi {name},\n\nThank you for contacting 90Ten Group. We received your message and will reply within two working days.\n\n"
             + $"What you sent us:\n{need}\n{msg}\n\nTailored. Engineered. Nurtured.\n90Ten Group\n6 Saddle Circle\nBlue Hills\n1685 Midrand\n"
    };

    try
    {
        await Deliver(app, cfg, toTeam, reply);
        return Results.Ok(new { ok = true });
    }
    catch (Exception ex)
    {
        log.LogError(ex, "Could not send the contact emails");
        return Results.Json(new { error = "We could not send your message just now. Please email us instead." }, statusCode: 500);
    }
});

app.Run();

// With no mail server set (local), the emails are saved as files in App_Data/outbox so the form can be tried.
static async Task Deliver(WebApplication app, IConfigurationSection cfg, params MimeMessage[] messages)
{
    string host = cfg["SmtpHost"] ?? "";
    if (string.IsNullOrWhiteSpace(host))
    {
        string dir = Path.Combine(app.Environment.ContentRootPath, "App_Data", "outbox");
        Directory.CreateDirectory(dir);
        foreach (MimeMessage m in messages)
        {
            string file = Path.Combine(dir, $"{DateTime.UtcNow:yyyyMMdd-HHmmssfff}-{WebUtility.UrlEncode(m.To.ToString())}.eml");
            await using FileStream fs = File.Create(file);
            await m.WriteToAsync(fs);
        }
        return;
    }

    using SmtpClient smtp = new();
    await smtp.ConnectAsync(host, cfg.GetValue("SmtpPort", 587), SecureSocketOptions.StartTls);
    string user = cfg["SmtpUser"] ?? "";
    if (user.Length > 0)
    {
        await smtp.AuthenticateAsync(user, cfg["SmtpPassword"] ?? "");
    }
    foreach (MimeMessage m in messages)
    {
        await smtp.SendAsync(m);
    }
    await smtp.DisconnectAsync(true);
}

public record ContactForm(string? Name, string? Email, string? Need, string? Message, string? Website);
