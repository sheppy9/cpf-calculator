const { createApp, ref } = Vue;

const app = createApp({
	data () {
		return {
			contributionRates: [
				{
					minAge: 1,
					maxAge: 55,
					employer: 17,
					employee: 20
				},
				{
					minAge: 56,
					maxAge: 60,
					employer: 15.5,
					employee: 17
				},
				{
					minAge: 61,
					maxAge: 65,
					employer: 12,
					employee: 11.5
				},
				{
					minAge: 66,
					maxAge: 70,
					employer: 9,
					employee: 7.5
				},
				{
					minAge: 71,
					maxAge: 200,
					employer: 7.5,
					employee: 5
				}
			],
			age: null,
			monthlyIncome: null,
			contributionRate: null,
			computedValues: {},

			personalInfo: {
				employerContribution: 0,
				employeeContribution: 0,
				totalContribution: 0,
				takeHomePay: 0
			}
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
			if (this.age < firstContribution.minAge || this.age > lastContribution.maxAge) {
				return;
			}

			for (let i = 0; i < self.contributionRates.length; i++) {
				if (self.age >= self.contributionRates[i].minAge && self.age <= self.contributionRates[i].maxAge) {
					self.contributionRate = self.contributionRates[i];
					break;
				}
			}

			self.calculateContribution();
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
			let totalContribution = employerContribution + employeeContribution;
			let takeHomePay = monthlyIncome - totalContribution;

			self.computedValues['Employer contribution'] = { 'value': '$ ' + employerContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' (' + contributionRate.employer + '%)' };
			self.computedValues['Employee contribution'] = { 'value': '$ ' + employeeContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' (' + contributionRate.employee + '%)' };
			self.computedValues['Total contribution'] = { 'value': '$ ' + totalContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
			self.computedValues['Take home pay'] = { 'value': '$ ' + takeHomePay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
		}
	},
	mounted () {
		this.inputUpdated();
	}
});

app.mount('#app');