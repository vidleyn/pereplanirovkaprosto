import { useEffect } from "react";

export default function ModalHandler() {
  useEffect(() => {
    // Простая реализация модалки без Bootstrap
    const modal = document.getElementById("add-items-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const closeButtons = [
      document.getElementById("modal-close-btn"),
      document.getElementById("modal-close-btn-footer"),
    ];

    if (!modal) return;

    // Функция открытия модалки
    const openModal = () => {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    // Функция закрытия модалки
    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    // Обработчики закрытия
    closeButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", closeModal);
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", closeModal);
    }

    // Закрытие по Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);

    // Обработка collapse для аккордеона
    const collapseButtons = document.querySelectorAll(
      '[data-toggle="collapse"]'
    );
    collapseButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute("data-target");
        if (targetId) {
          const target = document.querySelector(targetId);
          const svg = btn.querySelector("svg");
          if (target) {
            target.classList.toggle("hidden");
            if (svg) {
              svg.classList.toggle("rotate-180");
            }
          }
        }
      });
    });

    // Глобальная функция для открытия модалки (для legacy кода)
    (window as any).openAddItemsModal = openModal;

    // Обработка кликов на элементы с data-toggle="modal"
    const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Обработка кликов на #showAddItems (legacy кнопка)
    const showAddItemsBtn = document.getElementById("showAddItems");
    if (showAddItemsBtn) {
      showAddItemsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }

    // Эмуляция jQuery modal() для legacy кода
    // Ждем загрузки jQuery
    const initJQueryModal = () => {
      if ((window as any).jQuery) {
        const $ = (window as any).jQuery;
        // Переопределяем modal() для элементов с id="add-items-modal"
        const originalModal = $.fn.modal;
        $.fn.modal = function (action?: string) {
          const element = this[0];
          if (element && element.id === "add-items-modal") {
            if (action === "show" || !action) {
              openModal();
            } else if (action === "hide") {
              closeModal();
            }
            return this;
          }
          // Для других элементов используем оригинальный modal (если есть)
          if (originalModal) {
            return originalModal.apply(this, arguments as any);
          }
          return this;
        };
      } else {
        // Если jQuery еще не загружен, попробуем позже
        setTimeout(initJQueryModal, 100);
      }
    };
    initJQueryModal();

    return () => {
      closeButtons.forEach((btn) => {
        if (btn) {
          btn.removeEventListener("click", closeModal);
        }
      });
      if (backdrop) {
        backdrop.removeEventListener("click", closeModal);
      }
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return null;
}

