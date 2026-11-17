import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-indigo-700 text-white p-6 shadow-md">
        <h1 class="text-2xl font-bold">Requisición de Compra</h1>
        <p class="text-indigo-200 text-sm">Taller 08 · Rutas y Navegación</p>
      </header>

      <nav class="bg-white border-b shadow-sm">
        <div class="max-w-6xl mx-auto px-6 py-4">
          <ul class="flex gap-6 list-none">
            <li>
              <a
                routerLink="/requisiciones"
                routerLinkActive="text-indigo-600 font-semibold"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-sm hover:text-indigo-600 transition"
              >Listado</a
              >
            </li>
            <li>
              <a
                routerLink="/requisiciones/nueva"
                routerLinkActive="text-indigo-600 font-semibold"
                class="text-sm hover:text-indigo-600 transition"
              >Nueva Requisición</a
              >
            </li>
            <li>
              <a
                routerLink="/estadisticas"
                routerLinkActive="text-indigo-600 font-semibold"
                class="text-sm hover:text-indigo-600 transition"
              >Estadísticas</a
              >
            </li>
          </ul>
        </div>
      </nav>

      <main class="max-w-6xl mx-auto p-6">
        <router-outlet />
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Requisición de Compra';
}
