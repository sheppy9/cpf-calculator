const { createApp, ref } = Vue;

const app = createApp({
	data () {
		return {
			contributionRates: [
				{ minAge: 1, maxAge: 55, employer: 17, employee: 20 },
				{ minAge: 56, maxAge: 60, employer: 15.5, employee: 17 },
				{ minAge: 61, maxAge: 65, employer: 12, employee: 11.5 },
				{ minAge: 66, maxAge: 70, employer: 9, employee: 7.5 },
				{ minAge: 71, maxAge: 200, employer: 7.5, employee: 5 }
			],
			allocations: [
				{ minAge: 1, maxAge: 35, oaAllocation: 0.6217, saAllocation: 0.1621, maAllocation: 0.2162 },
				{ minAge: 36, maxAge: 45, oaAllocation: 0.5677, saAllocation: 0.1891, maAllocation: 0.2432 },
				{ minAge: 46, maxAge: 50, oaAllocation: 0.5136, saAllocation: 0.2162, maAllocation: 0.2702 },
				{ minAge: 51, maxAge: 55, oaAllocation: 0.4055, saAllocation: 0.3108, maAllocation: 0.2837 },
				{ minAge: 56, maxAge: 60, oaAllocation: 0.3872, saAllocation: 0.2741, maAllocation: 0.3387 },
				{ minAge: 61, maxAge: 65, oaAllocation: 0.1592, saAllocation: 0.3636, maAllocation: 0.4772 },
				{ minAge: 66, maxAge: 70, oaAllocation: 0.0607, saAllocation: 0.303, maAllocation: 0.6363 },
				{ minAge: 71, maxAge: 200, oaAllocation: 0.08, saAllocation: 0.08, maAllocation: 0.84 }
			],
			age: null,
			monthlyIncome: null,
			contributionRate: null,
			allocation: null,
			totalContribution: null,

			basicResults: {},
			allocationResults: {},
		};
	},
	methods: {
		inputUpdated () {
			let self = this;
			if (self.age == null) {
				return;
			}

			let firstContribution = self.contributionRates[0];
			let lastContribution = self.contributionRates[self.contributionRates.length - 1];
			if (self.age < firstContribution.minAge || self.age > lastContribution.maxAge) {
				self.contributionRate = null;
			} else {
				for (let i = 0; i < self.contributionRates.length; i++) {
					if (self.age >= self.contributionRates[i].minAge && self.age <= self.contributionRates[i].maxAge) {
						self.contributionRate = self.contributionRates[i];
						break;
					}
				}
			}

			let firstAllocation = self.allocations[0];
			let lastAllocation = self.allocations[self.allocations.length - 1];
			if (self.age < firstAllocation.minAge || self.age > lastAllocation.maxAge) {
				self.allocation = null;
			} else {
				for (let i = 0; i < self.allocations.length; i++) {
					if (self.age >= self.allocations[i].minAge && self.age <= self.allocations[i].maxAge) {
						self.allocation = self.allocations[i];
						break;
					}
				}
			}

			self.calculateContribution();
			self.calculateAllocation();
		},
		calculateContribution () {
			let self = this;

			let contributionRate = self.contributionRate;
			if (contributionRate == null) {
				return;
			}

			if (self.monthlyIncome == null) {
				return;
			}

			let monthlyIncome = self.monthlyIncome;

			let employerContribution = (contributionRate.employer / 100) * monthlyIncome;
			let employeeContribution = (contributionRate.employee / 100) * monthlyIncome;
			self.totalContribution = employerContribution + employeeContribution;

			let takeHomePay = monthlyIncome - self.totalContribution;

			self.basicResults['Employer Contribution'] = { 'value': self.toCurrency(employerContribution) };
			self.basicResults['Employee Contribution'] = { 'value': self.toCurrency(employeeContribution) };
			self.basicResults['Take Home'] = { 'value': self.toCurrency(takeHomePay) };
		},
		calculateAllocation () {
			let self = this;

			let allocation = self.allocation;
			if (allocation == null) {
				return;
			}

			if (self.monthlyIncome == null) {
				return;
			}

			if (self.totalContribution == null) {
				return;
			}

			let saAmt = allocation.saAllocation * self.totalContribution;
			let maAmt = allocation.maAllocation * self.totalContribution;
			let oaAmt = self.totalContribution - saAmt - maAmt;

			self.allocationResults['OA Allocation'] = { 'value': self.toCurrency(oaAmt) };
			self.allocationResults['SA Allocation'] = { 'value': self.toCurrency(saAmt) };
			self.allocationResults['MA Allocation'] = { 'value': self.toCurrency(maAmt) };
			self.allocationResults['Total Contribution'] = { 'value': self.toCurrency(self.totalContribution) };
		},
		toCurrency (value) {
			if (value == null) {
				return value;
			}
			return '$ ' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		}
	},
	mounted () {
		this.inputUpdated();
	}
});

app.mount('#app');