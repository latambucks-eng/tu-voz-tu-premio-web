import Home from './pages/Home';
import Contests from './pages/Contests';
import Participate from './pages/Participate';
import VotingRoom from './pages/VotingRoom';
import Winners from './pages/Winners';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistProfile from './pages/ArtistProfile';
import Legal from './pages/Legal';
import Bases from './pages/Bases';
import FanDashboard from './pages/FanDashboard';
import BuyCredits from './pages/BuyCredits';
import Withdraw from './pages/Withdraw';
import EditProfile from './pages/EditProfile';
import SelectRole from './pages/SelectRole';
import AdminDashboard from './pages/AdminDashboard';
import ModerationDashboard from './pages/ModerationDashboard';
import Community from './pages/Community';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import About from './pages/About';
import TestNotifications from './pages/TestNotifications';
import AdminPaymentLinks from './pages/AdminPaymentLinks';
import AdminSupport from './pages/AdminSupport';
import AdminWithdrawals from './pages/AdminWithdrawals';
import MyTickets from './pages/MyTickets';
import AdminStats from './pages/AdminStats';
import AdminSettings from './pages/AdminSettings';
import AdminUsers from './pages/AdminUsers';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Contests": Contests,
    "Participate": Participate,
    "VotingRoom": VotingRoom,
    "Winners": Winners,
    "ArtistDashboard": ArtistDashboard,
    "ArtistProfile": ArtistProfile,
    "Legal": Legal,
    "Bases": Bases,
    "FanDashboard": FanDashboard,
    "BuyCredits": BuyCredits,
    "Withdraw": Withdraw,
    "EditProfile": EditProfile,
    "SelectRole": SelectRole,
    "AdminDashboard": AdminDashboard,
    "ModerationDashboard": ModerationDashboard,
    "Community": Community,
    "Support": Support,
    "FAQ": FAQ,
    "About": About,
    "TestNotifications": TestNotifications,
    "AdminPaymentLinks": AdminPaymentLinks,
    "AdminSupport": AdminSupport,
    "AdminWithdrawals": AdminWithdrawals,
    "MyTickets": MyTickets,
    "AdminStats": AdminStats,
    "AdminSettings": AdminSettings,
    "AdminUsers": AdminUsers,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};