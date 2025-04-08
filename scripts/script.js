// Dữ liệu mẫu
const categoryData = [
    {
        id: 1,
        categoryName: 'Xe đạp địa hình',
        description: 'Phù hợp cho địa hình đồi núi, đường gồ ghề',
        type: 'Mountain Bike',
        image: '/api/placeholder/200/150'
    },
    {
        id: 2,
        categoryName: 'Xe đạp đường trường',
        description: 'Thiết kế cho đường trường và tốc độ cao',
        type: 'Road Bike',
        image: '/api/placeholder/200/150'
    },
    // ... (các danh mục khác)
];

const productData = [
    {
        id: 1,
        productName: 'Trek Marlin 7',
        brand: 'Trek',
        price: 15990000,
        quantity: 10,
        description: 'Xe đạp địa hình cao cấp, khung nhôm, phuộc Fox',
        imgURL: '/api/placeholder/250/200',
        categoryID: 1,
        frameSize: 'M (17.5")',
        wheelSize: '29"',
        color: 'Đỏ',
        material: 'Nhôm',
        isDeleted: false
    },
    // ... (các sản phẩm khác)
];

const serviceData = [
    {
        id: 1,
        name: 'Bảo dưỡng định kỳ',
        description: 'Kiểm tra toàn diện, vệ sinh và bôi trơn các chi tiết',
        price: 350000,
        duration: 60,
        status: true
    },
    // ... (các dịch vụ khác)
];

const reviewData = [
    {
        id: 1,
        user: {
            fullName: 'Nguyễn Văn A',
            avatarUrl: '/api/placeholder/50/50'
        },
        product: {
            productName: 'Trek Marlin 7'
        },
        rating: 5,
        title: 'Sản phẩm tuyệt vời',
        content: 'Xe đạp chất lượng cao, đi rất êm và bền.',
        isVerifiedPurchase: true,
        status: 'approved'
    },
    // ... (các đánh giá khác)
];

// Render danh mục sản phẩm
function renderCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    const categoriesHTML = categoryData.map(category => `
        <div class="category-card">
            <div class="category-img" style="background-image: url('${category.image}');"></div>
            <div class="category-info">
                <h3>${category.categoryName}</h3>
                <p>${category.description}</p>
                <a href="/danh-muc/${category.id}" class="btn btn-small">Xem thêm</a>
            </div>
        </div>
    `).join('');
    
    categoriesContainer.innerHTML = categoriesHTML;
}

// Render sản phẩm nổi bật
function renderFeaturedProducts() {
    const productsContainer = document.getElementById('featured-products');
    if (!productsContainer) return;

    const productsHTML = productData.map(product => {
        // Tìm tên danh mục từ id
        const category = categoryData.find(cat => cat.id === product.categoryID);
        const categoryName = category ? category.categoryName : '';
        
        // Format giá tiền
        const formattedPrice = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(product.price);
        
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-img" style="background-image: url('${product.imgURL}');">
                    ${product.quantity < 5 ? '<div class="product-badge">Sắp hết hàng</div>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${categoryName}</div>
                    <h3 class="product-title">${product.productName}</h3>
                    <div class="product-specs">
                        <span>Size: ${product.frameSize}</span>
                        <span>Màu: ${product.color}</span>
                    </div>
                    <div class="product-specs">
                        <span>Bánh: ${product.wheelSize}</span>
                        <span>Khung: ${product.material}</span>
                    </div>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-actions">
                        <a href="/san-pham/${product.id}" class="btn btn-small">Chi tiết</a>
                        <button class="btn btn-small add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    productsContainer.innerHTML = productsHTML;
    
    // Gắn sự kiện cho nút thêm giỏ hàng
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Render dịch vụ
function renderServices() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;

    const servicesHTML = serviceData.map(service => {
        // Format giá tiền
        const formattedPrice = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(service.price);
        
        return `
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <p>Giá: ${formattedPrice} - Thời gian: ${service.duration} phút</p>
                    <a href="/dat-lich/${service.id}" class="btn btn-small">Đặt lịch</a>
                </div>
            </div>
        `;
    }).join('');
    
    servicesContainer.innerHTML = servicesHTML;
}

// Render đánh giá
function renderTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;

    const testimonialsHTML = reviewData.map(review => {
        // Tạo chuỗi sao dựa trên rating
        const stars = Array.from({length: 5}, (_, i) => 
            `<i class="fas ${i < review.rating ? 'fa-star' : 'fa-star-o'}"></i>`
        ).join('');
        
        return `
            <div class="testimonial">
                <div class="testimonial-text">"${review.content}"</div>
                <div class="testimonial-rating">${stars}</div>
                <div class="testimonial-author">${review.user.fullName}</div>
                <div class="testimonial-product">Sản phẩm: ${review.product.productName}</div>
            </div>
        `;
    }).join('');
    
    testimonialsContainer.innerHTML = testimonialsHTML;
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    // Tìm sản phẩm theo id
    const product = productData.find(p => p.id == productId);
    if (!product) return;
    
    // Kiểm tra xem đã có LocalStorage chưa
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id == productId);
    
    if (existingProductIndex > -1) {
        // Nếu đã có, tăng số lượng
        cart[existingProductIndex].quantity += 1;
    } else {
        // Nếu chưa có, thêm mới với số lượng là 1
        cart.push({
            id: product.id,
            productName: product.productName,
            price: product.price,
            imgURL: product.imgURL,
            quantity: 1
        });
    }
    
    // Lưu giỏ hàng vào LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiển thị thông báo
    showNotification(`Đã thêm ${product.productName} vào giỏ hàng!`);
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng ở header
    updateCartCount();
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    // Tạo phần tử thông báo
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Thêm vào body
    document.body.appendChild(notification);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        notification.classList.add('notification-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng ở header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Cập nhật số lượng ở biểu tượng giỏ hàng nếu có thẻ này
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Đăng ký nhận tin
function subscribeNewsletter(email) {
    // Kiểm tra email hợp lệ
    if (!isValidEmail(email)) {
        showNotification('Vui lòng nhập địa chỉ email hợp lệ!', 'error');
        return;
    }
    
    // Giả lập gửi request API
    console.log(`Đã đăng ký email: ${email}`);
    
    // Hiển thị thông báo thành công
    showNotification('Cảm ơn bạn đã đăng ký nhận tin từ Cycle Shop!');
    
    // Reset form
    document.querySelector('.newsletter-form input').value = '';
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Khởi tạo form đăng ký nhận tin
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input');
        subscribeNewsletter(emailInput.value);
    });
}

// Khởi tạo tìm kiếm
function initSearch() {
    const searchForm = document.querySelector('.search-bar');
    if (!searchForm) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = this.querySelector('input');
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            // Giả lập tìm kiếm
            const results = productData.filter(product => 
                product.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (results.length > 0) {
                showNotification(`Tìm thấy ${results.length} sản phẩm`);
                // Có thể chuyển đến trang kết quả tìm kiếm
            } else {
                showNotification('Không tìm thấy sản phẩm nào', 'warning');
            }
        }
    });
}

// Khởi tạo các chức năng khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Render các phần tử động
    renderCategories();
    renderFeaturedProducts();
    renderServices();
    renderTestimonials();

    // Khởi tạo các chức năng
    updateCartCount();
    initNewsletterForm();
    initSearch();
});