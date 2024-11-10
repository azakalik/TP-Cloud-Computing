import https from 'https';

function sendDiscordMessage(webhookUrl, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ content: message });
    const url = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 204) {
        resolve();
      } else {
        reject(new Error(`Failed to send message, status code: ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

export const handler = async (event) => {
  const discordWebhookUrl = 'https://discord.com/api/webhooks/1304886278093013032/D040noX3I-7CmD53ZLEoD_NgEj-yW5jkL5N5QnOqgx-kj_4OAQsDB8KM0Mp-04LAzVAN';
  const message = `publicacionId: ${event.publicationId} mail ganador: ${event.mail}`;

  try {
    await sendDiscordMessage(discordWebhookUrl, message);
    console.log("Scheduled message sent to Discord.");
    return {
      statusCode: 200,
      body: JSON.stringify("Message sent successfully.")
    };
  } catch (error) {
    console.error("Failed to send scheduled message to Discord:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to send message.")
    };
  }
};
