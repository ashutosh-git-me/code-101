#include<iostream>
using namespace std;

int pivot(int arr[], int n){
    int s=0, e=n-1;
    while(s<e){
        int mid=s+(e-s)/2;
        if(arr[mid]>arr[e]){
            s=mid+1;
        }
        else e=mid;
    }
    return s;
}

int main()
{
    int arr[6]={5,7,9,1,3,5};
    cout<<pivot(arr,6);
    return 0;
}