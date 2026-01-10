 export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      login: "Login",
      profile: "Profile",
      logout: "Logout",
      adminPanel: "Admin"
    },
    
    // Hero section
    hero: {
      title: "Welcome to Eclipse Shop",
      subtitle: "Discover premium digital products, software, and services designed to elevate your business and creativity."
    },
    
    // Products
    products: {
      title: "Our Collection",
      search: "Search products...",
      filter: "Filter",
      subcategory: "Subcategory",
      all: "All",
      price: "Price",
      discountPrice: "Discount Price",
      buy: "Buy Now",
      loading: "Loading products...",
      noProducts: "No products found",
      noProductsDesc: "Try adjusting your filters or search terms to find what you're looking for.",
      quickView: "Quick View",
      addToCart: "Add to Cart"
    },
    
    // Categories
    categories: {
      software: "Software",
      templates: "Templates",
      education: "Education",
      design: "Design",
      media: "Media",
      games: "Games",
      entertainment: "Entertainment",
      utilities: "Utilities",
      development: "Development",
      business: "Business"
    },
    
    // Subcategories
    subcategories: {
      productivity: "Productivity",
      marketing: "Marketing",
      courses: "Courses",
      "ui-kits": "UI Kits",
      photos: "Photos",
      wordpress: "WordPress",
      freefire: "Free Fire",
      pubg: "PUBG",
      mobile: "Mobile Games",
      action: "Action Games",
      strategy: "Strategy Games",
      puzzle: "Puzzle Games"
    },
    
    // Authentication
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Full Name",
      signIn: "Sign In",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      loginSuccess: "Successfully logged in!",
      registerSuccess: "Account created successfully!",
      logoutSuccess: "Successfully logged out!"
    },
    
    // Profile
    profile: {
      title: "My Account",
      subtitle: "Manage your account and view your order history",
      user: "User",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      memberSince: "Member Since",
      accountId: "Account ID",
      tabs: {
        info: "Account Info",
        history: "Order History"
      }
    },

    // Orders
    orders: {
      error: "Sifarişlər yüklənilərkən xəta baş verdi",
      failedToFetch: "İstifadəçi sifarişləri alınmadı",
      permissionDenied: "Giriş icazəsi rədd edildi",
      indexError: "Verilənlər bazası sorğu xətası",
      networkError: "Şəbəkə bağlantısı xətası",
      serverError: "Server xətası",
      retry: "Yenidən cəhd et",
      orderId: "Order ID",
      noOrders: "No orders yet",
      noOrdersDesc: "When you purchase something, it will appear here.",
      status: {
        pending: "Pending",
        inProgress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled"
      }
    },
    
    // Purchase
    purchase: {
      title: "Complete Purchase",
      product: "Product",
      price: "Price",
      total: "Total",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "Enter your WhatsApp number",
      confirm: "Confirm Purchase",
      cancel: "Cancel",
      success: "Order placed successfully!",
      processing: "Processing your order...",
      orderReceived: "Order Received!",
      orderThanks: "Thank you for your purchase. Your order has been registered and is being processed.",
      orderSummary: "Summary",
      contactRequired: "Please enter your WhatsApp number or Telegram ID",
      failedOrder: "Failed to process order. Please try again.",
      orderIdCopied: "Order ID copied to clipboard!",
      nextSteps: "Next Steps",
      keepId: "Please keep this ID. Our team will contact you via {contactType} shortly to deliver your product.",
      continueShopping: "Continue Shopping",
      fullName: "Full Name",
      contactMethod: "Contact Method",
      telegramId: "Telegram ID / Username",
      placeholderWhatsapp: "+994 XX XXX XX XX",
      placeholderTelegram: "@username or ID",
      requiredContact: "Required for product delivery and order confirmation.",
      secureCheckout: "Secure Checkout",
      instantDelivery: "Instant Digital Delivery After Verification",
      completeOrderDetails: "Complete your order details to receive your digital assets."
    },
    
    // Cart
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      description: "Review your items and proceed to checkout",
      emptyTitle: "Your cart is empty",
      emptyDescription: "Add some products to get started",
      add: "Add to Cart",
      added: "Added to cart",
      removed: "Item removed from cart",
      total: "Total",
      processing: "Processing...",
      checkout: "Checkout Now",
      loginRequired: "Please log in to checkout"
    },

    // Admin
    admin: {
      dashboard: "Dashboard",
      dashboardDesc: "Overview of your shop's performance",
      totalOrders: "Total Orders",
      pendingOrders: "Pending Orders",
      completedOrders: "Completed",
      totalRevenue: "Total Revenue",
      lifetimeOrders: "Lifetime orders",
      requiresAttention: "Requires attention",
      successfullyDelivered: "Successfully delivered",
      fromCompletedOrders: "From completed orders",
      recentOrders: "Recent Orders",
      quickActions: "Quick Actions",
      systemStatus: "System Status",
      allSystemsOperational: "All systems operational",
      productManagement: "Product Management",
      manageProductsDesc: "Add, edit and manage your products",
      refresh: "Refresh",
      addProduct: "Add Product",
      searchProducts: "Search products...",
      loadingProducts: "Loading products...",
      noProductsFound: "No products found",
      image: "Image",
      productName: "Product Name",
      category: "Category",
      price: "Price",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      deactivate: "Deactivate",
      activate: "Activate",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this product? This action cannot be undone.",
      productUpdated: "Product status updated",
      productCreated: "Product created successfully",
      productUpdatedSuccess: "Product updated successfully",
      productDeleted: "Product deleted successfully",
      failedToFetch: "Failed to fetch products",
      failedToUpdate: "Failed to update status",
      failedToCreate: "Failed to create product",
      failedToUpdateProduct: "Failed to update product",
      failedToDelete: "Failed to delete product",
      errorOccurred: "An error occurred",
      userManagement: "User Management",
      manageUsersDesc: "View and manage user accounts",
      users: "Users",
      orders: "Orders",
      settings: "Settings",
      orderManagement: "Order Management",
      manageOrdersDesc: "Manage and track customer orders",
      checkOrderId: "Check Order ID...",
      loadingOrders: "Loading orders...",
      noOrdersFound: "No orders found",
      orderDetails: "Order Details",
      customer: "Customer",
      contact: "Contact",
      requested: "Requested",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",
      process: "Process",
      complete: "Complete",
      cancel: "Cancel",
      orderUpdated: "Order updated to",
      failedToUpdateOrder: "Failed to update status",
      failedToFetchOrders: "Failed to fetch orders",
      tryAgain: "Try Again"
    },

    // Modals
    modals: {
      confirm: "Confirm",
      cancel: "Cancel",
      close: "Close",
      save: "Save",
      delete: "Delete",
      yes: "Yes",
      no: "No",
      aboutTitle: "About Eclipse Shop",
      aboutDescription: "Learn more about our mission and the team behind Eclipse Shop.",
      aboutContent1: "Eclipse Shop is a curated marketplace for premium digital goods — templates, software, creative assets and educational products. Our mission is to make high-quality digital products accessible to creators and businesses worldwide.",
      aboutContent2: "Founded in 2024, our team focuses on product quality, secure checkout, and excellent support. We work with creators to showcase their best work and help customers find the tools they need.",
      contactTitle: "Contact Us",
      contactDescription: "Get in touch — we're here to help.",
      contactContent: "For general inquiries, please email <strong>support@eclipse-shop.example</strong>. For partnership or press, reach out to <strong>partners@eclipse-shop.example</strong>.",
      supportHours: "Support Hours",
      supportHoursValue: "Mon — Fri: 09:00 — 18:00 (UTC)",
      phone: "Phone",
      phoneValue: "+1 (555) 123-4567"
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      clear: "Clear",
      browseProducts: "Browse Products",
      id: "ID",
      name: "Name",
      email: "Email",
      date: "Date",
      status: "Status",
      actions: "Actions",
      created: "Created",
      updated: "Updated",
      unknown: "Unknown"
    },
    
    // Theme
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System"
    },
    
    // Language
    language: {
      en: "English",
      ru: "Русский",
      az: "Azərbaycan"
    }
  },
  
  ru: {
    // Navigation
    nav: {
      home: "Главная",
      products: "Товары",
      about: "О нас",
      contact: "Контакты",
      login: "Войти",
      profile: "Профиль",
      logout: "Выйти",
      adminPanel: "Админ"
    },
    
    // Hero section
    hero: {
      title: "Добро пожаловать в Eclipse Shop",
      subtitle: "Откройте для себя премиальные цифровые продукты, программное обеспечение и услуги, созданные для развития вашего бизнеса и творчества."
    },
    
    // Products
    products: {
      title: "Наша коллекция",
      search: "Поиск товаров...",
      filter: "Фильтр",
      subcategory: "Подкатегория",
      all: "Все",
      price: "Цена",
      discountPrice: "Цена со скидкой",
      buy: "Купить сейчас",
      loading: "Загрузка товаров...",
      noProducts: "Товары не найдены",
      noProductsDesc: "Попробуйте изменить фильтры или условия поиска.",
      quickView: "Быстрый просмотр",
      addToCart: "В корзину"
    },
    
    // Categories
    categories: {
      software: "Программы",
      templates: "Шаблоны",
      education: "Образование",
      design: "Дизайн",
      media: "Медиа",
      games: "Игры",
      entertainment: "Развлечения",
      utilities: "Утилиты",
      development: "Разработка",
      business: "Бизнес"
    },
    
    // Subcategories
    subcategories: {
      productivity: "Продуктивность",
      marketing: "Маркетинг",
      courses: "Курсы",
      "ui-kits": "UI Наборы",
      photos: "Фото",
      wordpress: "WordPress",
      freefire: "Free Fire",
      pubg: "PUBG",
      mobile: "Мобильные игры",
      action: "Экшн игры",
      strategy: "Стратегические игры",
      puzzle: "Головоломки"
    },
    
    // Authentication
    auth: {
      login: "Вход",
      register: "Регистрация",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      name: "Полное имя",
      signIn: "Войти",
      signUp: "Зарегистрироваться",
      forgotPassword: "Забыли пароль?",
      alreadyHaveAccount: "Уже есть аккаунт?",
      dontHaveAccount: "Нет аккаунта?",
      loginSuccess: "Успешный вход!",
      registerSuccess: "Аккаунт создан успешно!",
      logoutSuccess: "Успешный выход!"
    },
    
    // Profile
    profile: {
      title: "Мой аккаунт",
      subtitle: "Управляйте своим аккаунтом и просматривайте историю заказов",
      user: "Пользователь",
      editProfile: "Редактировать профиль",
      changePassword: "Изменить пароль",
      memberSince: "На сайте с",
      accountId: "ID аккаунта",
      tabs: {
        info: "Инфо",
        history: "История заказов"
      }
    },

    // Orders
    orders: {
      error: "Sifarişlər yüklənilərkən xəta baş verdi",
      failedToFetch: "İstifadəçi sifarişləri alınmadı",
      permissionDenied: "Giriş icazəsi rədd edildi",
      indexError: "Verilənlər bazası sorğu xətası",
      networkError: "Şəbəkə bağlantısı xətası",
      serverError: "Server xətası",
      retry: "Yenidən cəhd et",
      orderId: "ID заказа",
      noOrders: "Заказов пока нет",
      noOrdersDesc: "Когда вы что-то купите, это появится здесь.",
      status: {
        pending: "В ожидании",
        inProgress: "В процессе",
        completed: "Завершено",
        cancelled: "Отменено"
      }
    },
    
    // Purchase
    purchase: {
      title: "Завершить покупку",
      product: "Товар",
      price: "Цена",
      total: "Итого",
      whatsapp: "Номер WhatsApp",
      whatsappPlaceholder: "Введите ваш номер WhatsApp",
      confirm: "Подтвердить покупку",
      cancel: "Отмена",
      success: "Заказ успешно размещен!",
      processing: "Обработка вашего заказа...",
      orderReceived: "Заказ получен!",
      orderThanks: "Спасибо за покупку. Ваш заказ зарегистрирован и находится в обработке.",
      orderSummary: "Сводка",
      contactRequired: "Пожалуйста, введите ваш номер WhatsApp или Telegram ID",
      failedOrder: "Не удалось обработать заказ. Пожалуйста, попробуйте еще раз.",
      orderIdCopied: "ID заказа скопирован в буфер обмена!",
      nextSteps: "Следующие шаги",
      keepId: "Пожалуйста, сохраните этот ID. Наша команда свяжется с вами по {contactType} в ближайшее время для доставки вашего продукта.",
      continueShopping: "Продолжить покупки",
      fullName: "Полное имя",
      contactMethod: "Способ связи",
      telegramId: "Telegram ID / Имя пользователя",
      placeholderWhatsapp: "+994 XX XXX XX XX",
      placeholderTelegram: "@username или ID",
      requiredContact: "Требуется для доставки продукта и подтверждения заказа.",
      secureCheckout: "Безопасная оплата",
      instantDelivery: "Мгновенная доставка цифровых товаров после проверки"
    },

    // Cart
    cart: {
      title: "Корзина",
      empty: "Ваша корзина пуста",
      description: "Просмотрите свои товары и перейдите к оформлению",
      emptyTitle: "Ваша корзина пуста",
      emptyDescription: "Добавьте товары, чтобы начать",
      add: "В корзину",
      added: "Добавлено в корзину",
      removed: "Удалено из корзины",
      total: "Итого",
      processing: "Обработка...",
      checkout: "Оформить заказ",
      loginRequired: "Пожалуйста, войдите в систему для оформления заказа"
    },

    // Admin
    admin: {
      dashboard: "Панель управления",
      dashboardDesc: "Обзор производительности вашего магазина",
      totalOrders: "Всего заказов",
      pendingOrders: "Ожидающие заказы",
      completedOrders: "Завершенные",
      totalRevenue: "Общий доход",
      lifetimeOrders: "Заказов за все время",
      requiresAttention: "Требует внимания",
      successfullyDelivered: "Успешно доставлено",
      fromCompletedOrders: "От завершенных заказов",
      recentOrders: "Недавние заказы",
      quickActions: "Быстрые действия",
      systemStatus: "Статус системы",
      allSystemsOperational: "Все системы работают",
      productManagement: "Управление товарами",
      manageProductsDesc: "Добавляйте, редактируйте и управляйте своими товарами",
      refresh: "Обновить",
      addProduct: "Добавить товар",
      searchProducts: "Поиск товаров...",
      loadingProducts: "Загрузка товаров...",
      noProductsFound: "Товары не найдены",
      image: "Изображение",
      productName: "Название товара",
      category: "Категория",
      price: "Цена",
      status: "Статус",
      actions: "Действия",
      active: "Активный",
      inactive: "Неактивный",
      deactivate: "Деактивировать",
      activate: "Активировать",
      edit: "Редактировать",
      delete: "Удалить",
      confirmDelete: "Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.",
      productUpdated: "Статус товара обновлен",
      productCreated: "Товар успешно создан",
      productUpdatedSuccess: "Товар успешно обновлен",
      productDeleted: "Товар успешно удален",
      failedToFetch: "Не удалось загрузить товары",
      failedToUpdate: "Не удалось обновить статус",
      failedToCreate: "Не удалось создать товар",
      failedToUpdateProduct: "Не удалось обновить товар",
      failedToDelete: "Не удалось удалить товар",
      errorOccurred: "Произошла ошибка",
      userManagement: "Управление пользователями",
      manageUsersDesc: "Просмотр и управление учетными записями пользователей",
      users: "Пользователи",
      orders: "Заказы",
      settings: "Настройки",
      orderManagement: "Управление заказами",
      manageOrdersDesc: "Управление и отслеживание заказов клиентов",
      checkOrderId: "Проверить ID заказа...",
      loadingOrders: "Загрузка заказов...",
      noOrdersFound: "Заказы не найдены",
      orderDetails: "Детали заказа",
      customer: "Клиент",
      contact: "Контакт",
      requested: "Запрошено",
      processing: "Обработка",
      completed: "Завершено",
      cancelled: "Отменено",
      process: "Обработать",
      complete: "Завершить",
      cancel: "Отменить",
      orderUpdated: "Заказ обновлен до",
      failedToUpdateOrder: "Не удалось обновить статус",
      failedToFetchOrders: "Не удалось загрузить заказы",
      tryAgain: "Попробовать снова"
    },

    // Modals
    modals: {
      confirm: "Подтвердить",
      cancel: "Отмена",
      close: "Закрыть",
      save: "Сохранить",
      delete: "Удалить",
      yes: "Да",
      no: "Нет",
      aboutTitle: "О Eclipse Shop",
      aboutDescription: "Узнайте больше о нашей миссии и команде за Eclipse Shop.",
      aboutContent1: "Eclipse Shop - это кураторский рынок премиальных цифровых товаров — шаблоны, программное обеспечение, творческие активы и образовательные продукты. Наша миссия — сделать высококачественные цифровые продукты доступными для создателей и бизнеса по всему миру.",
      aboutContent2: "Основан в 2024 году, наша команда сосредоточена на качестве продуктов, безопасной оплате и отличной поддержке. Мы работаем с создателями, чтобы продемонстрировать их лучшую работу и помочь клиентам найти необходимые инструменты.",
      contactTitle: "Свяжитесь с нами",
      contactDescription: "Свяжитесь с нами — мы здесь, чтобы помочь.",
      contactContent: "По общим вопросам, пожалуйста, напишите на <strong>support@eclipse-shop.example</strong>. Для партнерства или прессы, обращайтесь на <strong>partners@eclipse-shop.example</strong>.",
      supportHours: "Часы поддержки",
      supportHoursValue: "Пн — Пт: 09:00 — 18:00 (UTC)",
      phone: "Телефон",
      phoneValue: "+1 (555) 123-4567"
    },
    // Common
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успех",
      cancel: "Отмена",
      confirm: "Подтвердить",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
      view: "Просмотр",
      close: "Закрыть",
      back: "Назад",
      next: "Далее",
      previous: "Предыдущий",
      search: "Поиск",
      filter: "Фильтр",
      sort: "Сортировка",
      clear: "Очистить",
      browseProducts: "Перейти к товарам",
      id: "ID",
      name: "Имя",
      email: "Email",
      date: "Дата",
      status: "Статус",
      actions: "Действия",
      created: "Создано",
      updated: "Обновлено",
      unknown: "Неизвестно"
    },
    
    // Theme
    theme: {
      light: "Светлая",
      dark: "Темная",
      system: "Системная"
    },
    
    // Language
    language: {
      en: "English",
      ru: "Русский",
      az: "Azərbaycan"
    }
  },
  
  az: {
    // Navigation
    nav: {
      home: "Ana səhifə",
      products: "Məhsullar",
      about: "Haqqımızda",
      contact: "Əlaqə",
      login: "Giriş",
      profile: "Profil",
      logout: "Çıxış",
      adminPanel: "Admin"
    },
    
    // Hero section
    hero: {
      title: "Eclipse Shop-a xoş gəlmisiniz",
      subtitle: "Biznesinizi və yaradıcılığınızı yüksəltmək üçün nəzərdə tutulmuş premium rəqəmsal məhsullar, proqram təminatı və xidmətləri kəşf edin."
    },
    
    // Products
    products: {
      title: "Bizim Kolleksiya",
      search: "Məhsul axtarın...",
      filter: "Filtr",
      subcategory: "Alt kateqoriya",
      all: "Hamısı",
      price: "Qiymət",
      discountPrice: "Endirimli qiymət",
      buy: "İndi alın",
      loading: "Məhsullar yüklənir...",
      noProducts: "Məhsul tapılmadı",
      noProductsDesc: "Axtardığınızı tapmaq üçün filtrləri və ya axtarış şərtlərini tənzimləməyə çalışın.",
      quickView: "Sürətli baxış",
      addToCart: "Səbətə əlavə et"
    },
    
    // Categories
    categories: {
      software: "Proqram təminatı",
      templates: "Şablonlar",
      education: "Təhsil",
      design: "Dizayn",
      media: "Media",
      games: "Oyunlar",
      entertainment: "Əyləncə",
      utilities: "Yardımcı Proqramlar",
      development: "Tərtibatçılıq",
      business: "Biznes"
    },
    
    // Subcategories
    subcategories: {
      productivity: "Məhsuldarlıq",
      marketing: "Marketinq",
      courses: "Kurslar",
      "ui-kits": "UI Kits",
      photos: "Fotoğraflar",
      wordpress: "WordPress",
      freefire: "Free Fire",
      pubg: "PUBG",
      mobile: "Mobil Oyunlar",
      action: "Əks Oyunlar",
      strategy: "Strategiya Oyunları",
      puzzle: "Bulmaca Oyunları"
    },
    
    // Authentication
    auth: {
      login: "Giriş",
      register: "Qeydiyyat",
      email: "Email",
      password: "Şifrə",
      confirmPassword: "Şifrəni təsdiq edin",
      name: "Tam ad",
      signIn: "Daxil ol",
      signUp: "Qeydiyyatdan keç",
      forgotPassword: "Şifrəni unutmusunuz?",
      alreadyHaveAccount: "Artıq hesabınız var?",
      dontHaveAccount: "Hesabınız yoxdur?",
      loginSuccess: "Uğurla daxil oldunuz!",
      registerSuccess: "Hesab uğurla yaradıldı!",
      logoutSuccess: "Uğurla çıxış etdiniz!",
      logoutError: "Çıxış zamanı xəta baş verdi"
    },
    
    // Profile
    profile: {
      title: "Hesabım",
      subtitle: "Hesabınızı idarə edin və sifariş tarixçənizə baxın",
      user: "İstifadəçi",
      editProfile: "Profili redaktə et",
      changePassword: "Şifrəni dəyiş",
      memberSince: "Üzvlük tarixi",
      accountId: "Hesab ID",
      tabs: {
        info: "Hesab məlumatı",
        history: "Sifariş tarixçəsi"
      }
    },

    // Orders
    orders: {
      error: "Sifarişlər yüklənilərkən xəta baş verdi",
      failedToFetch: "İstifadəçi sifarişləri alınmadı",
      permissionDenied: "Giriş icazəsi rədd edildi",
      indexError: "Verilənlər bazası sorğu xətası",
      networkError: "Şəbəkə bağlantısı xətası",
      serverError: "Server xətası",
      retry: "Yenidən cəhd et",
      orderId: "Sifariş ID",
      noOrders: "Hələ sifariş yoxdur",
      noOrdersDesc: "Bir şey aldığınız zaman burada görünəcək.",
      status: {
        pending: "Gözləmədə",
        inProgress: "İşlənilir",
        completed: "Tamamlandı",
        cancelled: "Ləğv edildi"
      }
    },
    
    // Purchase
    purchase: {
      title: "Alışı tamamla",
      product: "Məhsul",
      price: "Qiymət",
      total: "Cəmi",
      whatsapp: "WhatsApp nömrəsi",
      whatsappPlaceholder: "WhatsApp nömrənizi daxil edin",
      confirm: "Alışı təsdiq et",
      cancel: "Ləğv et",
      success: "Sifariş uğurla verildi!",
      processing: "Sifarişiniz işlənir...",
      orderReceived: "Sifariş qəbul edildi!",
      orderThanks: "Alışınız üçün təşəkkür edirik. Sifarişiniz qeydiyyatdan keçib və işlənilir.",
      orderSummary: "Xülasə",
      contactRequired: "Zəhmət olmasa WhatsApp nömrənizi və ya Telegram ID-nizi daxil edin",
      failedOrder: "Sifarişi emal etmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
      orderIdCopied: "Sifariş ID-si buferə kopyalandı!",
      nextSteps: "Növbəti addımlar",
      keepId: "Zəhmət olmasa bu ID-ni saxlayın. Komandamız tezliklə məhsulunuzu çatdırmaq üçün {contactType} vasitəsilə sizinlə əlaqə saxlayacaq.",
      continueShopping: "Alış-verişə davam et",
      fullName: "Tam ad",
      contactMethod: "Əlaqə üsulu",
      telegramId: "Telegram ID / İstifadəçi adı",
      placeholderWhatsapp: "+994 XX XXX XX XX",
      placeholderTelegram: "@istifadəçi adı və ya ID",
      requiredContact: "Məhsul çatdırılması və sifariş təsdiqi üçün tələb olunur.",
      secureCheckout: "Təhlükəsiz ödəniş",
      instantDelivery: "Yoxlamadan sonra rəqəmsal məhsulların dərhal çatdırılması"
    },

    // Cart
    cart: {
      title: "Alış-veriş səbəti",
      empty: "Səbətiniz boşdur",
      description: "Məhsullarınızı nəzərdən keçirin və ödənişə keçin",
      emptyTitle: "Səbətiniz boşdur",
      emptyDescription: "Başlamaq üçün məhsullar əlavə edin",
      add: "Səbətə əlavə et",
      added: "Səbətə əlavə edildi",
      removed: "Səbətdən çıxarıldı",
      total: "Cəmi",
      processing: "İşlənilir...",
      checkout: "İndi ödə",
      loginRequired: "Ödəniş üçün daxil olun"
    },

    // Admin
    admin: {
      dashboard: "İdarə paneli",
      dashboardDesc: "Mağazanızın performansına ümumi baxış",
      totalOrders: "Ümumi sifarişlər",
      pendingOrders: "Gözləyən sifarişlər",
      completedOrders: "Tamamlanan",
      totalRevenue: "Ümumi gəlir",
      lifetimeOrders: "Bütün vaxt sifarişləri",
      requiresAttention: "Diqqət tələb edir",
      successfullyDelivered: "Uğurla çatdırıldı",
      fromCompletedOrders: "Tamamlanan sifarişlərdən",
      recentOrders: "Son sifarişlər",
      quickActions: "Sürətli əməliyyatlar",
      systemStatus: "Sistem statusu",
      allSystemsOperational: "Bütün sistemlər işləyir",
      productManagement: "Məhsul idarəetməsi",
      manageProductsDesc: "Məhsullarınızı əlavə edin, redaktə edin və idarə edin",
      refresh: "Yenilə",
      addProduct: "Məhsul əlavə et",
      searchProducts: "Məhsul axtarın...",
      loadingProducts: "Məhsullar yüklənir...",
      noProductsFound: "Məhsul tapılmadı",
      image: "Şəkil",
      productName: "Məhsul adı",
      category: "Kateqoriya",
      price: "Qiymət",
      status: "Status",
      actions: "Əməliyyatlar",
      active: "Aktiv",
      inactive: "Qeyri-aktiv",
      deactivate: "Deaktiv et",
      activate: "Aktivləşdir",
      edit: "Redaktə et",
      delete: "Sil",
      confirmDelete: "Bu məhsulu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.",
      productUpdated: "Məhsul statusu yeniləndi",
      productCreated: "Məhsul uğurla yaradıldı",
      productUpdatedSuccess: "Məhsul uğurla yeniləndi",
      productDeleted: "Məhsul uğurla silindi",
      failedToFetch: "Məhsullar yüklənilə bilmədi",
      failedToUpdate: "Status yenilənilə bilmədi",
      failedToCreate: "Məhsul yaradıla bilmədi",
      failedToUpdateProduct: "Məhsul yenilənilə bilmədi",
      failedToDelete: "Məhsul silinə bilmədi",
      errorOccurred: "Xəta baş verdi",
      userManagement: "İstifadəçi idarəetməsi",
      manageUsersDesc: "İstifadəçi hesablarını göstər və idarə et",
      users: "İstifadəçilər",
      orders: "Sifarişlər",
      settings: "Parametrlər",
      orderManagement: "Sifariş idarəetməsi",
      manageOrdersDesc: "Müştəri sifarişlərini idarə et və izlə",
      checkOrderId: "Sifariş ID yoxla...",
      loadingOrders: "Sifarişlər yüklənir...",
      noOrdersFound: "Sifariş tapılmadı",
      orderDetails: "Sifariş detalları",
      customer: "Müştəri",
      contact: "Əlaqə",
      requested: "Tələb edildi",
      processing: "İşlənilir",
      completed: "Tamamlandı",
      cancelled: "Ləğv edildi",
      process: "İşlə",
      complete: "Tamamla",
      cancel: "Ləğv et",
      orderUpdated: "Sifariş yeniləndi",
      failedToUpdateOrder: "Status yenilənilə bilmədi",
      failedToFetchOrders: "Sifarişlər yüklənilə bilmədi",
      tryAgain: "Yenidən cəhd et"
    },

    // Modals
    modals: {
      confirm: "Təsdiq et",
      cancel: "Ləğv et",
      close: "Bağla",
      save: "Yadda saxla",
      delete: "Sil",
      yes: "Bəli",
      no: "Xeyr",
      aboutTitle: "Eclipse Shop haqqında",
      aboutDescription: "Bizim missiyamız və Eclipse Shop komandası haqqında daha çox məlumat əldə edin.",
      aboutContent1: "Eclipse Shop premium rəqəmsal məhsullar üçün kurator bazar yeridir — şablonlar, proqram təminatı, yaradıcı aktivlər və təhsil məhsulları. Bizim missiyamız yüksək keyfiyyətli rəqəmsal məhsulları dünya üzrə yaradıcılara və bizneslərə əlçatan etməkdir.",
      aboutContent2: "2024-cü ildə təsis edilmişdir, komandamız məhsul keyfiyyətinə, təhlükəsiz ödənişə və mükəmməl dəstəyə fokuslanır. Biz yaradıcılarla işləyirik ki, onların ən yaxşı işlərini nümayiş etdirək və müştərilərə lazım olan alətləri tapmağa kömək edək.",
      contactTitle: "Əlaqə",
      contactDescription: "Əlaqə saxlayın — biz kömək etmək üçün buradayıq.",
      contactContent: "Ümumi suallar üçün, zəhmət olmasa <strong>support@eclipse-shop.example</strong> ünvanına yazın. Tərəfdaşlıq və ya mətbuat üçün <strong>partners@eclipse-shop.example</strong> ilə əlaqə saxlayın.",
      supportHours: "Dəstək Saatları",
      supportHoursValue: "B.e — C.a: 09:00 — 18:00 (UTC)",
      phone: "Telefon",
      phoneValue: "+1 (555) 123-4567"
    },

    // Common
    common: {
      loading: "Yüklənir...",
      error: "Xəta",
      success: "Uğur",
      cancel: "Ləğv et",
      confirm: "Təsdiq et",
      save: "Yadda saxla",
      delete: "Sil",
      edit: "Redaktə et",
      view: "Bax",
      close: "Bağla",
      back: "Geri",
      next: "Növbəti",
      previous: "Əvvəlki",
      search: "Axtar",
      filter: "Filtr",
      sort: "Sırala",
      clear: "Təmizlə",
      browseProducts: "Məhsullara bax",
      id: "ID",
      name: "Ad",
      email: "Email",
      date: "Tarix",
      status: "Status",
      actions: "Əməliyyatlar",
      created: "Yaradıldı",
      updated: "Yeniləndi",
      unknown: "Naməlum"
    },
    
    // Theme
    theme: {
      light: "Açıq",
      dark: "Tünd",
      system: "Sistem"
    },
    
    // Language
    language: {
      en: "English",
      ru: "Русский",
      az: "Azərbaycan"
    }
  }
};
