package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.DndSubclass;
import com.utils.data.Data;

@Service
public class DndSubclassService extends BaseService {
    private static final String GET_SUBCLASS_BY_ID_SQL = "SELECT * FROM custom_dnd_subclasses WHERE subclass_id = ?";
    private static final String GET_SUBCLASSES_BY_CLASS_SQL = "SELECT * FROM custom_dnd_subclasses WHERE class_index = ? ORDER BY name";
    private static final String INSERT_SUBCLASS_SQL = "INSERT INTO custom_dnd_subclasses (name, class_index, is_custom_class) VALUES (?, ?, ?) RETURNING subclass_id";
    private static final String UPDATE_SUBCLASS_SQL = "UPDATE custom_dnd_subclasses SET name = ?, class_index = ?, is_custom_class = ? WHERE subclass_id = ?";
    private static final String DELETE_SUBCLASS_SQL = "DELETE FROM custom_dnd_subclasses WHERE subclass_id = ?";

    public DndSubclassService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public DndSubclass getSubclassById(Integer subclassId) throws SQLException {
        List<DndSubclass> subclasses = this.data.Query(
                GET_SUBCLASS_BY_ID_SQL,
                (PreparedStatement ps) -> ps.setInt(1, subclassId),
                (ResultSet rs) -> mapSubclass(rs));

        if (subclasses.isEmpty()) {
            throw new IllegalArgumentException("Subclass not found with ID: " + subclassId);
        }

        return subclasses.get(0);
    }

    public List<DndSubclass> getSubclassesByClass(String classIndex) throws SQLException {
        return this.data.Query(
                GET_SUBCLASSES_BY_CLASS_SQL,
                (PreparedStatement ps) -> ps.setString(1, classIndex),
                (ResultSet rs) -> mapSubclass(rs));
    }

    public DndSubclass createSubclass(DndSubclass subclass) throws SQLException {
        Integer subclassId = this.data.InsertWithKey(
                INSERT_SUBCLASS_SQL,
                (PreparedStatement ps) -> {
                    ps.setString(1, subclass.getName());
                    ps.setString(2, subclass.getClassIndex());
                    ps.setBoolean(3, subclass.getIsCustomClass() != null ? subclass.getIsCustomClass() : false);
                });
        subclass.setSubclassId(subclassId);
        return subclass;
    }

    public DndSubclass updateSubclass(DndSubclass subclass) throws SQLException {
        // First verify the subclass exists
        getSubclassById(subclass.getSubclassId());

        // Update the subclass
        this.data.Execute(
                UPDATE_SUBCLASS_SQL,
                (PreparedStatement ps) -> {
                    ps.setString(1, subclass.getName());
                    ps.setString(2, subclass.getClassIndex());
                    ps.setBoolean(3, subclass.getIsCustomClass() != null ? subclass.getIsCustomClass() : false);
                    ps.setInt(4, subclass.getSubclassId());
                });

        return subclass;
    }

    public void deleteSubclass(Integer subclassId) throws SQLException {
        this.data.Execute(
                DELETE_SUBCLASS_SQL,
                (PreparedStatement ps) -> ps.setInt(1, subclassId));
    }

    private DndSubclass mapSubclass(ResultSet rs) throws SQLException {
        DndSubclass subclass = new DndSubclass();
        subclass.setSubclassId(rs.getInt("subclass_id"));
        subclass.setName(rs.getString("name"));
        subclass.setIndex(subclass.getName().toLowerCase().replace(" ", "_"));
        subclass.setClassIndex(rs.getString("class_index"));
        subclass.setIsCustomClass(rs.getBoolean("is_custom_class"));
        subclass.setIsCustom(true);
        return subclass;
    }
}
