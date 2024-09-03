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
				{ minAge: 1, maxAge: 35, oaAllocation: 62.17, saAllocation: 16.21, maAllocation: 21.62 },
				{ minAge: 36, maxAge: 45, oaAllocation: 56.77, saAllocation: 18.91, maAllocation: 24.32 },
				{ minAge: 46, maxAge: 50, oaAllocation: 51.36, saAllocation: 21.62, maAllocation: 27.02 },
				{ minAge: 51, maxAge: 55, oaAllocation: 40.55, saAllocation: 31.08, maAllocation: 28.37 },
				{ minAge: 56, maxAge: 60, oaAllocation: 38.72, saAllocation: 27.41, maAllocation: 33.87 },
				{ minAge: 61, maxAge: 65, oaAllocation: 15.92, saAllocation: 36.36, maAllocation: 47.72 },
				{ minAge: 66, maxAge: 70, oaAllocation: 6.07, saAllocation: 30.3, maAllocation: 63.63 },
				{ minAge: 71, maxAge: 200, oaAllocation: 8, saAllocation: 8, maAllocation: 84 }
			],
			age: null,
			monthlyIncome: null,
			cacheLocally: false,
			contributionRate: null,
			allocation: null,
			totalContribution: null,

			basicResults: {},
			allocationResults: {},
		};
	},
	methods: {
		init () {
			let self = this;
			let data = localStorage.getItem('data') || '{}';
			data = JSON.parse(data);

			for (const [key, value] of Object.entries(data)) {
				if (key.length == 0) {
					continue;
				}

				self.$data[key] = value;
			}
		},
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

			self.saveToCache();
			self.calculateContribution();
			self.calculateAllocation();
		},
		saveToCache () {
			let self = this;
			let data = localStorage.getItem('data') || '{}';
			data = JSON.parse(data);
			$('input.cacheable').each((i, e) => {
				let field = $(e).prop('id');
				data[field] = self.$data[field];
			});

			localStorage.setItem('data', JSON.stringify(data));
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

			let saAmt = (allocation.saAllocation / 100) * self.totalContribution;
			let maAmt = (allocation.maAllocation / 100) * self.totalContribution;
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
		this.init();
		this.inputUpdated();
	}
});

app.mount('#app');