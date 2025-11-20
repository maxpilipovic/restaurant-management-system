from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Edge()
driver.get("http://localhost:5173/")
driver.maximize_window()

try:
    # Wait for the React root to actually render something
    WebDriverWait(driver, 30).until(
        lambda d: d.find_element(By.ID, "root").get_attribute("innerHTML").strip() != ""
    )
    print("✅ React app has loaded")

    # Now wait for the input fields to appear
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    )
    email_input.send_keys("test@example.com")

    password_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='password']"))
    )
    password_input.send_keys("password123")

    print("✅ Successfully filled out the form!")

except Exception as e:
    print("❌ Error:", e)
    print("URL:", driver.current_url)
    print(driver.page_source[:1000])  # show first 1000 chars for debugging

finally:
    driver.quit()