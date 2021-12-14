import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
import matplotlib.pyplot as plt
samples = 1000
max_price = 500
seed = 41
pd.set_option("display.width", 100)

larger_df = pd.read_csv('data.csv')
larger_df.dropna(subset=['averageWage'], inplace=True)
larger_df.dropna(subset=['population'], inplace=True)
larger_df.dropna(subset=['percentVotedBiden'], inplace=True)


larger_df["GunPerPop"] = larger_df["population"]/larger_df["gunEvents"]


model = ols('gunEvents ~ (averageWage * percentVotedBiden) / population',
            data=larger_df).fit()
print(model.summary())
anova = sm.stats.anova_lm(model, typ=2)
print(anova)
print("\n")

model = sm.OLS(larger_df.percentVotedBiden, larger_df.averageWage)
results = model.fit()
print(results.summary())


plt.figure(1, figsize=(14, 8))
plt.scatter(larger_df.population, larger_df.gunEvents)
plt.xlabel("County Population")
plt.ylabel("Amount of Gun Incidents in county since 2013")


plt.figure(2, figsize=(14, 8))
plt.scatter(larger_df.percentVotedBiden, larger_df.gunEvents)
plt.xlabel("Percent of county that Voted Biden")
plt.ylabel("Amount of Gun Incidents in county since 2013")

plt.figure(3, figsize=(14, 8))
plt.scatter(larger_df.percentVotedBiden, larger_df.averageWage)
plt.xlabel("Percent of county that Voted Biden")
plt.ylabel("Average Annual Salary of county")


plt.figure(4, figsize=(14, 8))
plt.scatter(larger_df.averageWage, larger_df.gunEvents)
plt.xlabel("Average Annual Salary of county")
plt.ylabel("Percent of county that Voted Biden")


plt.show()
