package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.SubclassFeature;
import com.utils.data.Data;

@Service
public class SubclassFeatureService extends BaseService {
    private static final String GET_FEATURES_FOR_SUBCLASS_SQL = "SELECT * FROM subclass_features WHERE subclass_id = ? ORDER BY level, name";
    private static final String DELETE_FEATURES_FOR_SUBCLASS_SQL = "DELETE FROM subclass_features WHERE subclass_id = ?";
    private static final String INSERT_FEATURE_SQL = "INSERT INTO subclass_features (subclass_id, name, description, level) VALUES (?, ?, ?, ?) RETURNING subclass_feature_id";

    public SubclassFeatureService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public List<SubclassFeature> getFeaturesForSubclass(Integer subclassId) throws SQLException {
        return this.data.Query(
                GET_FEATURES_FOR_SUBCLASS_SQL,
                (PreparedStatement ps) -> ps.setInt(1, subclassId),
                (ResultSet rs) -> mapSubclassFeature(rs));
    }

    public List<SubclassFeature> updateFeaturesForSubclass(Integer subclassId, List<SubclassFeature> newFeatures)
            throws SQLException {
        this.deleteFeaturesForSubclass(subclassId);
        return this.insertFeaturesForSubclass(subclassId, newFeatures);
    }

    private void deleteFeaturesForSubclass(Integer subclassId) throws SQLException {
        this.data.Execute(
                DELETE_FEATURES_FOR_SUBCLASS_SQL,
                (PreparedStatement ps) -> ps.setInt(1, subclassId));
    }

    private List<SubclassFeature> insertFeaturesForSubclass(Integer subclassId, List<SubclassFeature> newFeatures)
            throws SQLException {
        for (SubclassFeature feature : newFeatures) {
            // Insert the feature
            Integer featureId = this.data.InsertWithKey(
                    INSERT_FEATURE_SQL,
                    (PreparedStatement ps) -> {
                        ps.setInt(1, subclassId);
                        ps.setString(2, feature.getName());
                        ps.setString(3, feature.getDescription());
                        ps.setInt(4, feature.getLevel());
                    });

            // Set the feature ID
            feature.setSubclassFeatureId(featureId);
            feature.setSubclassId(subclassId);
        }

        return newFeatures;
    }

    private SubclassFeature mapSubclassFeature(ResultSet rs) throws SQLException {
        SubclassFeature feature = new SubclassFeature();
        feature.setSubclassFeatureId(rs.getInt("subclass_feature_id"));
        feature.setSubclassId(rs.getInt("subclass_id"));
        feature.setName(rs.getString("name"));
        feature.setDescription(rs.getString("description"));
        feature.setLevel(rs.getInt("level"));
        return feature;
    }
}
