#include<iostream>
using namespace std;

int binary(int arr[], int s, int e, int key){
    int mid= s+ (e-s)/2;
    while(s<=e){
        if(arr[mid]==key){
            return mid;
        }
        else if(arr[mid]>key){
            e=mid-1;
        }
        else{
            s=mid+1;
        }
        mid=s+(e-s)/2;
    }
    return -1;
}

int pivot(int arr[], int n){
    int s=0, e=n-1;
    int mid=s+(e-s)/2;
    while(s<e){
        if(arr[mid]>=arr[0]){
            s=mid+1;
        }
        else e=mid;
        mid=s+(e-s)/2;
    }
    return s;
}


int search(int arr[], int n, int key){
    int p=pivot(arr, n);
    if(key >= arr[0] && key <= arr[p-1]){
        return binary(arr, 0, p-1, key);
    }
    else {
        return binary(arr, p, n-1, key);
    }
    return -1;
}

int main()
{
    int arr[11]={9 ,1 ,7 , 8, 10, 11, 1, 2, 3, 4, 5 };
    cout<<search(arr,11,1)<<endl;
    return 0;
}