import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
// types.ts
export type Permission = string | string[];

export interface PermissionControlProps {
    /**
     * Required permissions
     */
    permission?: Permission;
    /**
     * Content displayed when granted permission
     */
    children: React.ReactNode;
    /**
     * The content displayed without permission is null by default
     */
    noPermission?: React.ReactNode;
    /**
     * Custom permission verification function
     * @param userPermissions User permission list
     * @param requiredPermissions Required permissions
     * @returns Do you have permission?
     */
    checkPermission?: (userPermissions: string[], requiredPermissions: Permission) => boolean;
}


const PermissionControl: React.FC<PermissionControlProps> = (props) => {
    const {
        permission,
        children,
        noPermission = null,
        checkPermission: otherCheckPermission,
    } = props;

     // 获取用户权限列表
     const userPermissions = useSelector((state: RootState) => state.permission.permissions) ?? [];


    if (permission === undefined || permission === null || permission === '') {
        return <>{children}</>;
    }

    //Default permission check function
    const defaultCheckPermission = (userPermissions: string[], requiredPermissions: Permission): boolean => {
        if (!requiredPermissions) return true;

        if (Array.isArray(requiredPermissions)) {
            return requiredPermissions.some(permission =>
                userPermissions.includes(permission)
            );
        }

        return userPermissions.includes(requiredPermissions);
    };
    

    const checkPermission = otherCheckPermission || defaultCheckPermission;
    const hasPermission = checkPermission(userPermissions, permission);

    return (hasPermission ? <>{children}</> : <>{noPermission}</>);
};

export default PermissionControl;