import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/HomePage";
import LoginPage from "./components/LoginAccountPage";
import LogoutPage from "./components/LogoutAccountPage";
import RegisterAccount from "./components/RegisterAccountPage";
import BankAccountOverview from "./components/BankAccountOverviewPage";
import StatementFebruary2022 from "./statements/StatementFebruary2022";
import StatementMarch2022 from "./statements/StatementMarch2022";
import StatementApril2022 from "./statements/StatementApril2022";
import StatementMay2022 from "./statements/StatementMay2022";
import StatementJune2022 from "./statements/StatementJune2022";
import StatementJuly2022 from "./statements/StatementJuly2022";
import StatementAugust2022 from "./statements/StatementAugust2022";
import StatementSeptember2022 from "./statements/StatementSeptember2022";
import StatementOctober2022 from "./statements/StatementOctober2022";
import StatementNovember2022 from "./statements/StatementNovember2022";
import StatementDecember2022 from "./statements/StatementDecember2022";
import StatementJanuary2023 from "./statements/StatementJanuary2023";
import Statement2February2022 from "./statements2/Statement2February2022";
import Statement2March2022 from "./statements2/Statement2March2022";
import Statement2April2022 from "./statements2/Statement2April2022";
import Statement2May2022 from "./statements2/Statement2May2022";
import Statement2June2022 from "./statements2/Statement2June2022";
import Statement2July2022 from "./statements2/Statement2July2022";
import Statement2August2022 from "./statements2/Statement2August2022";
import Statement2September2022 from "./statements2/Statement2September2022";
import Statement2October2022 from "./statements2/Statement2October2022";
import Statement2November2022 from "./statements2/Statement2November2022";
import Statement2December2022 from "./statements2/Statement2December2022";
import Statement2January2023 from "./statements2/Statement2January2023";
import ErrorPage from "./components/ErrorPage";

import './css/App.css';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home/>} exact />
				<Route path="/login" element={<LoginPage/>} />
				<Route path="/logout" element={<LogoutPage />} />
				<Route path="/register" element={<RegisterAccount/>} />
				<Route path="/bankAccountOverview" element={<BankAccountOverview />} />
				<Route path="/StatementFebruary2022" element={<StatementFebruary2022 />} />
				<Route path="/StatementMarch2022" element={<StatementMarch2022 />} />
				<Route path="/StatementApril2022" element={<StatementApril2022 />} />
				<Route path="/StatementMay2022" element={<StatementMay2022 />} />
				<Route path="/StatementJune2022" element={<StatementJune2022 />} />
				<Route path="/StatementJuly2022" element={<StatementJuly2022 />} />
				<Route path="/StatementAugust2022" element={<StatementAugust2022 />} />
				<Route path="/StatementSeptember2022" element={<StatementSeptember2022 />} />
				<Route path="/StatementOctober2022" element={<StatementOctober2022 />} />
				<Route path="/StatementNovember2022" element={<StatementNovember2022 />} />
				<Route path="/StatementDecember2022" element={<StatementDecember2022 />} />
				<Route path="/StatementJanuary2023" element={<StatementJanuary2023 />} />
				
				<Route path="/Statement2February2022" element={<Statement2February2022 />} />
				<Route path="/Statement2March2022" element={<Statement2March2022 />} />
				<Route path="/Statement2April2022" element={<Statement2April2022 />} />
				<Route path="/Statement2May2022" element={<Statement2May2022 />} />
				<Route path="/Statement2June2022" element={<Statement2June2022 />} />
				<Route path="/Statement2July2022" element={<Statement2July2022 />} />
				<Route path="/Statement2August2022" element={<Statement2August2022 />} />
				<Route path="/Statement2September2022" element={<Statement2September2022 />} />
				<Route path="/Statement2October2022" element={<Statement2October2022 />} />
				<Route path="/Statement2November2022" element={<Statement2November2022 />} />
				<Route path="/Statement2December2022" element={<Statement2December2022 />} />
				<Route path="/Statement2January2023" element={<Statement2January2023 />} />
				<Route path="*" element={<ErrorPage/>} />
			</Routes>
		</BrowserRouter>
	);
};


export default App;
