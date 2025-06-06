package com;

import javax.sql.DataSource;

import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.utils.data.Data;
import com.utils.data.SecretManager;

@Configuration
public class FargopolisDataSourceConfig {
	
	private final AppConfigProperties appConfig;

    public FargopolisDataSourceConfig(AppConfigProperties appConfig) {
        this.appConfig = appConfig;
    }

	@Bean
	public DataSource dataSource() {
		final DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.postgresql.Driver");
		
		// Set the data source url.
		if (this.appConfig.isUseAwsSecrets()) {
			String secret = SecretManager.getSecret(this.appConfig.getDbSecretName(), this.appConfig.getAwsSecretRegion());
			JSONObject secretObj = new JSONObject(secret);
			dataSource.setUrl("jdbc:postgresql://" + secretObj.getString("host")
					+ "/" + secretObj.getString("dbname")
					+ "?user=" + secretObj.getString("username")
					+ "&password=" + secretObj.getString("password"));
		} else {
			dataSource.setUrl("jdbc:postgresql://localhost:5432/fargopolis-local?user=postgres&password=imanogre");
		}
		
		return dataSource;
	}
	
	@Bean
	public Data data(DataSource dataSource) {
		return new Data(dataSource);
	}
}
