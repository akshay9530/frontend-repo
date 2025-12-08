import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from './hooks/useCart';
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import NewArrivals from "./pages/NewArrivals";
import OrderTrackingPage from "./components/OrderTrackingPage";
import MenFragrance from "./pages/MenFragrance";
import WomenFragrance from "./pages/WomenFragrance";
import MenWatch from "./pages/MenWatch";
import WomenWatch from "./pages/WomenWatch";
import WomenShoes from "./pages/WomenShoes";
import SaleOffers from "./pages/SaleOffers";
import TvPage from './pages/TVPage';
import EarbudsPage from './pages/EarbudsPage';
import MobilePage from './pages/MobilePage';
import NikeStore from "./pages/NikeStore";
import PumaStore from "./pages/PumaStore";
import AppleStore from "./pages/AppleStore";
import TitanStore from "./pages/TitanStore";
import HMStore from "./pages/HMStore";
import SonyStore from "./pages/SonyStore";
import SamsungStore from "./pages/SamsungStore";
import AdidasStore from "./pages/AdidasStore";
import FossilStore from "./pages/FossilStore";
import CalvinStore from "./pages/CalvinStore";
import LeviStore from "./pages/LeviStore";
import CasioStore from "./pages/casioStore";
import MenClothes from "./pages/MenClothes";
import WomenClothes from "./pages/WomenClothes";
import MenShoes from "./pages/MenShoes";
import SignIn from './User/SignIn';
import SignUp from './User/SignUp';
import Help from './User/Help';
import CheckoutPage from "./components/CheckoutPage";
import Profile from "./components/Profile";



// Admin imports
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminRevenue from "./admin/AdminRevenue";
import AdminSettings from "./admin/AdminSettings";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <main className="pt-16 bg-white min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/fragrance/men" element={<MenFragrance />} />
            <Route path="/fragrance/women" element={<WomenFragrance />} />
            <Route path="/watch/men" element={<MenWatch />} />
            <Route path="/watch/women" element={<WomenWatch />} />
            <Route path="/clothes/men" element={<MenClothes/>} />
            <Route path="/clothes/women" element={<WomenClothes />} />
            <Route path="/sneakers/women" element={<WomenShoes />} />
            <Route path="/sneakers/men" element={<MenShoes />} />
            <Route path="/SaleOffers" element={<SaleOffers/>} />
            <Route path="/electronics/tv" element={<TvPage/>} />
            <Route path="/electronics/earbuds" element={<EarbudsPage/>} />
            <Route path="/electronics/smartphone" element={<MobilePage/>} />
            <Route path="/brands/nike" element={<NikeStore/>} />
            <Route path="/brands/puma" element={<PumaStore/>} />
            <Route path="/brands/apple" element={<AppleStore/>} />
            <Route path="/brands/titan" element={<TitanStore/>} />
            <Route path="/brands/hm" element={<HMStore/>} />
            <Route path="/brands/sony" element={<SonyStore/>} />
            <Route path="/brands/samsung" element={<SamsungStore/>} />
            <Route path="/brands/adidas" element={<AdidasStore/>} />
            <Route path="/brands/fossil" element={<FossilStore/>} />
            <Route path="/brands/calvin-klein" element={<CalvinStore/>} />
            <Route path="/brands/levis" element={<LeviStore/>} />
            <Route path="/brands/casio" element={<CasioStore/>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
             <Route path="/help" element={<Help />} />
             <Route path="/checkout" element={<CheckoutPage/>} />
            {/* Add this route for order tracking */}
            <Route path="/track-order/:orderId?" element={<OrderTrackingPage />} />
             

            <Route path="/profile"  element={<Profile />} />

             {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={
              <PrivateRoute adminOnly={true}>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="revenue" element={<AdminRevenue />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;