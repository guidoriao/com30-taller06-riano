import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-no-encontrada',
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded shadow border border-gray-200 max-w-md mx-auto mt-12">
      <h2 class="text-2xl font-bold text-red-700 mb-2">Página no encontrada</h2>
      <p class="text-gray-600 mb-4">
        La ruta <strong class="text-gray-800">{{ urlIntentada }}</strong> no existe.
      </p>
      <button
        (click)="volver()"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Volver al listado
      </button>
    </div>
  `,
  styles: []
})
export class NoEncontradaComponent {
  private router = inject(Router);
  urlIntentada = this.router.url;

  volver() {
    this.router.navigate(['/requisiciones']);
  }
}
