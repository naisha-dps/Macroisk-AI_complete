import pandas as pd
import numpy as np
import os
import joblib
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error, r2_score
from statsmodels.tsa.stattools import adfuller 

def train_arimax_model():
    """Trains ARIMAX model using a 90/10 time-series split on the master macro dataset."""
    database_path = "/Users/dominating-spirit/newbackend/master_macro_dataset.csv"
    if not os.path.exists(database_path):
        raise FileNotFoundError(f"Master dataset not found at {database_path}.")

    df = pd.read_csv(database_path)

    # Parse using day/month/year
    df['Date'] = pd.to_datetime(
        df['Date'],
        format="%d/%m/%Y"
    )

    df = df.set_index("Date")
    df = df.asfreq('MS') # Ensure monthly frequency

    target = df['CPI_Inflation_Rate'].dropna()
    exog = df[['WPI', 'Repo_Rate', 'oil_price', 'exchange_rate']].loc[target.index]

    # Align data
    model_df = pd.concat([target, exog], axis=1).dropna()
    y = model_df['CPI_Inflation_Rate']
    X = model_df[['WPI', 'Repo_Rate', 'oil_price', 'exchange_rate']]

    # 80/20 chronological split
    train_size = int(len(model_df) * 0.80)
    y_train, y_test = y.iloc[:train_size], y.iloc[train_size:] # Align lengths
    X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]

    # Fit ARIMAX on training slice
    model = SARIMAX(y_train, exog=X_train, order=(2,1,1), seasonal_order=(1,0,1,12))
    results = model.fit(maxiter=500, disp=False)

    print(model.order)
    print(results.summary())

    predictions = []

    history_y = y_train.copy()
    history_X = X_train.copy()

    for i in range(len(y_test)):

        model = SARIMAX(
            history_y,
            exog=history_X,
            order=(2,1,1),
            seasonal_order=(1,0,1,12)
        )

        results = model.fit(
            maxiter=500,
            disp=False
        )

        pred = results.forecast(
            steps=1,
            exog=X_test.iloc[[i]]
        )

        predictions.append(pred.iloc[0])

        # Add the ACTUAL observation before forecasting the next month
        history_y = pd.concat([history_y, y_test.iloc[[i]]])
        history_X = pd.concat([history_X, X_test.iloc[[i]]])

    y_pred = pd.Series(predictions, index=y_test.index)

    from sklearn.metrics import (
        mean_squared_error,
        mean_absolute_error,
        r2_score
    )

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\n===== Forecast Performance =====")
    print(f"MSE : {mse:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE : {mae:.4f}")
    print(f"R²  : {r2:.4f}")

    # --- ADDED CODE TO SAVE THE MODEL ---
    os.makedirs("models", exist_ok=True) 
    model_path = "models/arimax_inflation_model.pkl"
    joblib.dump(results, model_path)
    print(f"\n✅ ARIMAX Model successfully saved to: {model_path}")
    # ------------------------------------

if __name__ == "__main__":
    train_arimax_model()
