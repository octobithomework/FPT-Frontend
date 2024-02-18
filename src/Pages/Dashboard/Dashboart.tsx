import { ChakraProvider, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import Calendar from "./Components/Calendar";
import './Dashboard.css';


const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard-container">
            <ChakraProvider>
                <Calendar />
            </ChakraProvider>
        </div>
    );
};

export default DashboardPage;