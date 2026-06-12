export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, brief, commercialEmail, clientEmail } = req.body;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Resend key not configured' });

  const emails = [];

  if (type === 'new_brief') {
    // Email to commercial
    if (commercialEmail) {
      emails.push({
        from: 'Goodie · The Good Web <noreply@thegoodweb.eu>',
        to: commercialEmail,
        subject: `Nouveau brief — ${brief.compte} · ${brief.campagne}`,
        html: `
          <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#fff">
            <div style="background:#001858;padding:24px 32px">
              <div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:.05em">THE GOOD WEB</div>
              <div style="font-size:9px;color:#79BEFF;letter-spacing:.12em;margin-top:2px">· THE GOOD AUDIENCE</div>
            </div>
            <div style="padding:32px">
              <div style="font-size:13px;color:#79BEFF;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Nouveau brief reçu</div>
              <div style="font-size:22px;font-weight:500;color:#001858;margin-bottom:4px">${brief.campagne || 'Sans titre'}</div>
              <div style="font-size:14px;color:#9ca3af;margin-bottom:24px">${brief.compte || ''}</div>
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#9ca3af;width:140px">Objectif</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#1f2937">${brief.objectif || '—'}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#9ca3af">Budget</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#1f2937">${brief.budget || '—'}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#9ca3af">Période</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#1f2937">${brief.debut || '?'} → ${brief.fin || '?'}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#9ca3af">Géographie</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#1f2937">${brief.geo || '—'}</td></tr>
                <tr><td style="padding:10px 0;font-size:13px;color:#9ca3af">Contact</td><td style="padding:10px 0;font-size:13px;color:#1f2937">${brief.email_contact || '—'}</td></tr>
              </table>
              <a href="https://brief.thegoodweb.eu" style="display:inline-block;background:#001858;color:#fff;font-size:13px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none">Voir le brief complet</a>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center">
              Goodie · Assistant média The Good Web
            </div>
          </div>`
      });
    }

    // Confirmation email to client
    if (clientEmail) {
      const commercialNames = { jerome: 'Jérôme', mathilde: 'Mathilde', leslie: 'Leslie' };
      const comName = commercialNames[brief.commercial] || 'notre équipe';
      emails.push({
        from: 'The Good Web <noreply@thegoodweb.eu>',
        to: clientEmail,
        subject: `Votre brief a bien été reçu — ${brief.campagne}`,
        html: `
          <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#fff">
            <div style="background:#001858;padding:24px 32px">
              <div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:.05em">THE GOOD WEB</div>
              <div style="font-size:9px;color:#79BEFF;letter-spacing:.12em;margin-top:2px">· THE GOOD AUDIENCE</div>
            </div>
            <div style="padding:32px">
              <div style="font-size:22px;font-weight:500;color:#001858;margin-bottom:8px">Brief bien reçu !</div>
              <div style="font-size:14px;color:#4b5563;line-height:1.7;margin-bottom:24px">
                Merci pour votre brief <strong>${brief.campagne}</strong>. Notre équipe l'a bien reçu et <strong>${comName}</strong> vous recontactera sous 48h.
              </div>
              <div style="background:#E8F4FF;border-radius:10px;padding:20px;margin-bottom:24px">
                <div style="font-size:12px;color:#79BEFF;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Récapitulatif</div>
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:6px 0;font-size:13px;color:#9ca3af;width:120px">Campagne</td><td style="padding:6px 0;font-size:13px;color:#001858;font-weight:500">${brief.campagne || '—'}</td></tr>
                  <tr><td style="padding:6px 0;font-size:13px;color:#9ca3af">Objectif</td><td style="padding:6px 0;font-size:13px;color:#001858">${brief.objectif || '—'}</td></tr>
                  <tr><td style="padding:6px 0;font-size:13px;color:#9ca3af">Votre contact</td><td style="padding:6px 0;font-size:13px;color:#001858;font-weight:500">${comName}</td></tr>
                </table>
              </div>
              <a href="https://brief.thegoodweb.eu" style="display:inline-block;background:#001858;color:#fff;font-size:13px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none">Suivre mon brief</a>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center">
              The Good Web · brief.thegoodweb.eu
            </div>
          </div>`
      });
    }
  }

  if (type === 'plan_media_ready') {
    if (clientEmail) {
      const com = commerciaux ? commerciaux[brief.commercial] : null;
      emails.push({
        from: 'The Good Web <noreply@thegoodweb.eu>',
        to: clientEmail,
        subject: `Votre plan média est prêt — ${brief.campagne}`,
        html: `
          <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#fff">
            <div style="background:#001858;padding:24px 32px">
              <div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:.05em">THE GOOD WEB</div>
              <div style="font-size:9px;color:#79BEFF;letter-spacing:.12em;margin-top:2px">· THE GOOD AUDIENCE</div>
            </div>
            <div style="padding:32px">
              <div style="font-size:13px;color:#79BEFF;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Plan média disponible</div>
              <div style="font-size:22px;font-weight:500;color:#001858;margin-bottom:8px">${brief.campagne||'Votre campagne'}</div>
              <div style="font-size:14px;color:#4b5563;line-height:1.7;margin-bottom:24px">
                Bonne nouvelle ! Votre plan média pour la campagne <strong>${brief.campagne}</strong> est prêt. Vous pouvez le consulter dès maintenant en cliquant sur le bouton ci-dessous.
              </div>
              <div style="margin-bottom:24px">
                <a href="${brief.lien_plan_media}" target="_blank" style="display:inline-block;background:#79BEFF;color:#001858;font-size:14px;font-weight:600;padding:14px 28px;border-radius:9px;text-decoration:none">
                  ↗ Ouvrir le plan média
                </a>
              </div>
              <div style="background:#E8F4FF;border-radius:10px;padding:16px 20px;font-size:13px;color:#4b5563;line-height:1.6">
                Des questions sur ce plan média ? Contactez directement votre chargé(e) de clientèle The Good Web.
              </div>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center">
              The Good Web · brief.thegoodweb.eu
            </div>
          </div>`
      });
    }
  }

  if (type === 'brief_edited') {
    const editedByLabel = brief.by === 'regie' ? "L'équipe The Good Web" : "Votre client";
    const recipient = brief.by === 'client' ? commercialEmail : clientEmail;
    const recipientLabel = brief.by === 'client' ? 'le commercial' : 'le client';
    if (recipient) {
      const subjectLine = brief.by === 'client'
        ? `Brief modifié par le client — ${brief.compte} · ${brief.campagne}`
        : `Votre brief a été mis à jour — ${brief.campagne}`;
      const bodyText = brief.by === 'client'
        ? `<strong>${brief.compte}</strong> vient de modifier son brief <strong>${brief.campagne}</strong>. Connectez-vous pour consulter les changements.`
        : `Votre brief <strong>${brief.campagne}</strong> a été mis à jour par votre commercial. Connectez-vous pour consulter les modifications.`;
      emails.push({
        from: 'The Good Web <noreply@thegoodweb.eu>',
        to: recipient,
        subject: subjectLine,
        html: `
          <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#fff">
            <div style="background:#001858;padding:24px 32px">
              <div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:.05em">THE GOOD WEB</div>
              <div style="font-size:9px;color:#79BEFF;letter-spacing:.12em;margin-top:2px">· THE GOOD AUDIENCE</div>
            </div>
            <div style="padding:32px">
              <div style="font-size:13px;color:#79BEFF;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Brief modifié</div>
              <div style="font-size:22px;font-weight:500;color:#001858;margin-bottom:16px">${brief.campagne||'Sans titre'}</div>
              <div style="font-size:14px;color:#4b5563;line-height:1.7;margin-bottom:24px">${bodyText}</div>
              <a href="https://brief.thegoodweb.eu" style="display:inline-block;background:#001858;color:#fff;font-size:13px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none">Voir le brief</a>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center">
              The Good Web · brief.thegoodweb.eu
            </div>
          </div>`
      });
    }
  }

  if (type === 'status_change') {
    const statusLabels = { traitement: 'En traitement', attente: 'En attente de validation', gagne: 'Gagné', perdu: 'Perdu' };
    const label = statusLabels[brief.statut] || brief.statut;
    if (clientEmail) {
      emails.push({
        from: 'The Good Web <noreply@thegoodweb.eu>',
        to: clientEmail,
        subject: `Mise à jour de votre campagne — ${brief.campagne}`,
        html: `
          <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#fff">
            <div style="background:#001858;padding:24px 32px">
              <div style="font-size:16px;font-weight:700;color:#fff;letter-spacing:.05em">THE GOOD WEB</div>
              <div style="font-size:9px;color:#79BEFF;letter-spacing:.12em;margin-top:2px">· THE GOOD AUDIENCE</div>
            </div>
            <div style="padding:32px">
              <div style="font-size:22px;font-weight:500;color:#001858;margin-bottom:8px">Mise à jour de votre campagne</div>
              <div style="font-size:14px;color:#4b5563;line-height:1.7;margin-bottom:24px">
                Votre campagne <strong>${brief.campagne}</strong> est passée au statut <strong style="color:#001858">${label}</strong>.
              </div>
              <a href="https://brief.thegoodweb.eu" style="display:inline-block;background:#001858;color:#fff;font-size:13px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none">Voir le détail</a>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center">
              The Good Web · brief.thegoodweb.eu
            </div>
          </div>`
      });
    }
  }

  try {
    for (const email of emails) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(email)
      });
    }
    return res.status(200).json({ ok: true, sent: emails.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
