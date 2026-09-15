'use client';

import { FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const destinationEmail = 'ceroclima.cl@gmail.com';

export function EmailQuoteDialog() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const commune = String(data.get('commune') ?? '').trim();
    const space = String(data.get('space') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = `Solicitud de cotización — ${name}`;
    const body = [
      'Hola CEROCLIMA:',
      '',
      'Quisiera solicitar una cotización de climatización.',
      '',
      `Nombre: ${name}`,
      `Correo: ${email}`,
      `Teléfono: ${phone || 'No informado'}`,
      `Comuna: ${commune}`,
      `Tipo de espacio: ${space}`,
      '',
      'Detalle de la solicitud:',
      message,
    ].join('\n');

    window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Dialog>
      <DialogTrigger render={<button className="button button-email" type="button" />}>
        <Mail aria-hidden="true" />
        Cotizar por correo
      </DialogTrigger>
      <DialogContent className="email-quote-dialog">
        <DialogHeader>
          <span className="section-kicker">Contacto por correo</span>
          <DialogTitle>Cuéntanos sobre tu proyecto</DialogTitle>
          <DialogDescription>
            Completa los datos y abriremos tu aplicación de correo con la solicitud lista para enviar a CEROCLIMA.
          </DialogDescription>
        </DialogHeader>

        <form className="email-quote-form" onSubmit={handleSubmit}>
          <div className="email-form-grid">
            <label>
              <span>Nombre</span>
              <input name="name" type="text" autoComplete="name" required placeholder="Tu nombre" />
            </label>
            <label>
              <span>Correo</span>
              <input name="email" type="email" autoComplete="email" required placeholder="nombre@correo.cl" />
            </label>
            <label>
              <span>Teléfono</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="+56 9…" />
            </label>
            <label>
              <span>Comuna</span>
              <input name="commune" type="text" autoComplete="address-level2" required placeholder="Ej. Chillán" />
            </label>
            <label className="email-form-full">
              <span>Tipo de espacio</span>
              <select name="space" required defaultValue="">
                <option value="" disabled>Selecciona una opción</option>
                <option>Hogar</option>
                <option>Local comercial</option>
                <option>Oficina</option>
                <option>Proyecto industrial</option>
                <option>Otro</option>
              </select>
            </label>
            <label className="email-form-full">
              <span>¿Qué necesitas cotizar?</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Cuéntanos los metros cuadrados aproximados, cantidad de espacios o cualquier dato útil."
              />
            </label>
          </div>

          <button className="button button-orange email-submit" type="submit">
            <Send aria-hidden="true" />
            Preparar correo
          </button>
          <p className="email-form-note">
            Podrás revisar y enviar el mensaje desde tu aplicación de correo. Destinatario: {destinationEmail}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
